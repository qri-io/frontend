package api

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	golog "github.com/ipfs/go-log"
	"github.com/qri-io/ioes"
	"github.com/qri-io/qri/lib"
	"github.com/qri-io/qrimatic/scheduler"
)

var log = golog.Logger("api")

func init() {
	golog.SetLogLevel("api", "debug")
}

// RepoDirName is the directory within repo to store update data
// using the default path, it'll work out to $HOME/.qri/update
const RepoDirName = "update"

// Path returns a directory within a repo for storing data related to the update
// service. update data is stored in a directory called "update"
func Path(repoPath string) (path string, err error) {
	path = filepath.Join(repoPath, RepoDirName)
	err = os.MkdirAll(path, os.ModePerm)
	return
}

type Server struct {
	inst  *lib.Instance
	sched *scheduler.Cron
}

func NewServer(inst *lib.Instance) (*Server, error) {
	path, err := Path(inst.RepoPath())
	if err != nil {
		return nil, err
	}

	var store scheduler.Store
	// switch cfg.Type {
	// case "fs":
	store, err = scheduler.NewFileStore(filepath.Join(path, "workflows.json"))
	// case "mem":
	// 	workflowStore = scheduler.NewMemStore()
	// 	logStore = scheduler.NewMemStore()
	// default:
	// 	return fmt.Errorf("unknown cron type: %q", cfg.Type)
	// }

	svc := scheduler.NewCron(store, Factory, inst.Bus())
	log.Debug("starting update service")
	// go func() {
	// 	if err := svc.ServeHTTP(cfg.Addr); err != nil {
	// 		log.Errorf("starting cron http server: %s", err)
	// 	}
	// }()

	return &Server{
		inst:  inst,
		sched: svc,
	}, nil
}

// Start runs the cron service, blocking until an error occurs
func (s *Server) Start(ctx context.Context) error {
	return s.sched.Start(ctx)
}

// Factory returns a function that can run workflows
func Factory(context.Context) scheduler.RunWorkflowFunc {
	return func(ctx context.Context, streams ioes.IOStreams, workflow *scheduler.Workflow) error {
		log.Debugf("running update: %s", workflow.Name)

		var errBuf *bytes.Buffer
		// if the workflow type is a dataset, error output is semi-predictable
		// write to a buffer for better error reporting
		if workflow.Type == scheduler.JTDataset {
			errBuf = &bytes.Buffer{}
			teedErrOut := io.MultiWriter(streams.ErrOut, errBuf)
			streams = ioes.NewIOStreams(streams.In, streams.Out, teedErrOut)
		}

		cmd := WorkflowToCmd(streams, workflow)
		if cmd == nil {
			return fmt.Errorf("unrecognized update type: %s", workflow.Type)
		}

		err := cmd.Run()
		return processWorkflowError(workflow, errBuf, err)
	}
}

func processWorkflowError(workflow *scheduler.Workflow, errOut *bytes.Buffer, err error) error {
	if err == nil {
		return nil
	}

	if workflow.Type == scheduler.JTDataset && errOut != nil {
		// TODO (b5) - this should be a little more stringent :(
		if strings.Contains(errOut.String(), "no changes to save") {
			// TODO (b5) - this should be a concrete error declared in dsfs:
			// dsfs.ErrNoChanges
			return fmt.Errorf("no changes to save")
		}
	}

	return err
}

// WorkflowToCmd returns an operating system command that will execute the given workflow
// wiring operating system in/out/errout to the provided iostreams.
func WorkflowToCmd(streams ioes.IOStreams, workflow *scheduler.Workflow) *exec.Cmd {
	switch workflow.Type {
	case scheduler.JTDataset:
		return datasetSaveCmd(streams, workflow)
	case scheduler.JTShellScript:
		return shellScriptCmd(streams, workflow)
	default:
		return nil
	}
}

// datasetSaveCmd configures a "qri save" command based on workflow details
// wiring operating system in/out/errout to the provided iostreams.
func datasetSaveCmd(streams ioes.IOStreams, workflow *scheduler.Workflow) *exec.Cmd {
	args := []string{"save", workflow.Name}

	if o, ok := workflow.Options.(*scheduler.DatasetOptions); ok {
		if o.Title != "" {
			args = append(args, fmt.Sprintf(`--title=%s`, o.Title))
		}
		if o.Message != "" {
			args = append(args, fmt.Sprintf(`--message=%s`, o.Message))
		}
		if o.Recall != "" {
			args = append(args, fmt.Sprintf(`--recall=%s`, o.Recall))
		}
		if o.BodyPath != "" {
			args = append(args, fmt.Sprintf(`--body=%s`, o.BodyPath))
		}
		if len(o.FilePaths) > 0 {
			for _, path := range o.FilePaths {
				args = append(args, fmt.Sprintf(`--file=%s`, path))
			}
		}

		// TODO (b5) - config and secrets

		boolFlags := map[string]bool{
			"--publish":     o.Publish,
			"--strict":      o.Strict,
			"--force":       o.Force,
			"--keep-format": o.ConvertFormatToPrev,
			"--no-render":   !o.ShouldRender,
		}
		for flag, use := range boolFlags {
			if use {
				args = append(args, flag)
			}
		}
	}

	cmd := exec.Command("qri", args...)
	cmd.Stderr = streams.ErrOut
	cmd.Stdout = streams.Out
	cmd.Stdin = streams.In
	return cmd
}

// shellScriptCmd creates an exec.Cmd, wires operating system in/out/errout
// to the provided iostreams.
// Commands are executed with access to the same enviornment variables as the
// process the runner is executing in
func shellScriptCmd(streams ioes.IOStreams, workflow *scheduler.Workflow) *exec.Cmd {
	// TODO (b5) - config and secrets as env vars

	cmd := exec.Command(workflow.Name)
	cmd.Stderr = streams.ErrOut
	cmd.Stdout = streams.Out
	cmd.Stdin = streams.In
	return cmd
}
