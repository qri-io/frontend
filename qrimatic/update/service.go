// Package update defines the update service
package update

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	golog "github.com/ipfs/go-log"
	"github.com/qri-io/dataset"
	"github.com/qri-io/ioes"
	"github.com/qri-io/qri/event"
	"github.com/qri-io/qri/lib"
	"github.com/qri-io/qrimatic/scheduler"
)

var log = golog.Logger("update")

func init() {
	golog.SetLogLevel("update", "debug")
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

// Config fields adjust the behaviour of the update service
type Config struct {
	Type string
	Addr string
}

// Start starts the update service
func Start(ctx context.Context, repoPath string, cfg *Config) error {
	httpCli := scheduler.HTTPClient{Addr: cfg.Addr}
	if err := httpCli.Ping(); err == nil {
		return fmt.Errorf("service already running")
	}

	return start(ctx, repoPath, cfg)
}

func start(ctx context.Context, repoPath string, cfg *Config) error {
	path, err := Path(repoPath)
	if err != nil {
		return err
	}

	var store scheduler.Store
	switch cfg.Type {
	case "fs":
		store, err = scheduler.NewFileStore(filepath.Join(path, "scheduler.json"))
		if err != nil {
			return err
		}
	case "mem":
		store = scheduler.NewMemStore()
	default:
		return fmt.Errorf("unknown scheduler type: %q", cfg.Type)
	}

	svc := scheduler.NewCron(store, Factory, event.NilBus)
	log.Debug("starting update service")
	go func() {
		if err := svc.ServeHTTP(cfg.Addr); err != nil {
			log.Errorf("starting scheduler http server: %s", err)
		}
	}()

	return svc.Start(ctx)
}

type Service struct {
	inst      *lib.Instance
	scheduler *scheduler.Cron
}

func NewService(inst *lib.Instance) (*Service, error) {
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
	// 	return fmt.Errorf("unknown scheduler type: %q", cfg.Type)
	// }

	svc := scheduler.NewCron(store, LocalInstanceFactory(inst), inst.Bus())
	log.Debug("starting update service")
	// go func() {
	// 	if err := svc.ServeHTTP(cfg.Addr); err != nil {
	// 		log.Errorf("starting scheduler http server: %s", err)
	// 	}
	// }()

	return &Service{
		inst:      inst,
		scheduler: svc,
	}, nil
}

// AddRoutes registers scheduler routes with an *http.Mux.
func (s *Service) AddRoutes(m *http.ServeMux, mw func(http.HandlerFunc) http.HandlerFunc) {
	scheduler.AddCronRoutes(m, s.scheduler, mw)
}

// Start runs the scheduler service, blocking until an error occurs
func (s *Service) Start(ctx context.Context) error {
	return s.scheduler.Start(ctx)
}

// Factory returns a function that can run workflows
func Factory(context.Context) scheduler.RunTransformFunc {
	return func(ctx context.Context, streams ioes.IOStreams, workflow *scheduler.Workflow) error {
		log.Debugf("running update: %s", workflow.Name)

		var errBuf *bytes.Buffer
		// if the workflow type is a dataset, error output is semi-predictable
		// write to a buffer for better error reporting
		errBuf = &bytes.Buffer{}
		teedErrOut := io.MultiWriter(streams.ErrOut, errBuf)
		streams = ioes.NewIOStreams(streams.In, streams.Out, teedErrOut)

		cmd := WorkflowToCmd(streams, workflow)
		err := cmd.Run()
		return processWorkflowError(workflow, errBuf, err)
	}
}

func LocalInstanceFactory(inst *lib.Instance) func(context.Context) scheduler.RunTransformFunc {
	return func(ctx context.Context) scheduler.RunTransformFunc {
		return func(ctx context.Context, streams ioes.IOStreams, workflow *scheduler.Workflow) error {
			log.Debugf("running workflow with an instance factory: %w", workflow.ID)
			var errBuf *bytes.Buffer
			// if the workflow type is a dataset, error output is semi-predictable
			// write to a buffer for better error reporting
			errBuf = &bytes.Buffer{}
			teedErrOut := io.MultiWriter(streams.ErrOut, errBuf)
			streams = ioes.NewIOStreams(streams.In, streams.Out, teedErrOut)

			dsm := lib.NewDatasetMethods(inst)

			getResult := &lib.GetResult{}
			if err := dsm.Get(&lib.GetParams{Refstr: workflow.DatasetID}, getResult); err != nil {
				log.Errorw("getting dataset", "err", err, "datasetID", workflow.DatasetID)
			}

			p := &lib.SaveParams{
				Dataset: getResult.Dataset,
				Apply:   true,
			}
			res := &dataset.Dataset{}
			err := dsm.Save(p, res)
			return processWorkflowError(workflow, errBuf, err)
		}
	}
}

// WorkflowToCmd returns an operating system command that will execute the given workflow
// wiring operating system in/out/errout to the provided iostreams.
func WorkflowToCmd(streams ioes.IOStreams, workflow *scheduler.Workflow) *exec.Cmd {
	return datasetSaveCmd(streams, workflow)
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

// DatasetToWorkflow converts a dataset to scheduler.Workflow
func DatasetToWorkflow(ds *dataset.Dataset, periodicity string, opts *scheduler.DatasetOptions) (workflow *scheduler.Workflow, err error) {
	if periodicity == "" && ds.Meta != nil && ds.Meta.AccrualPeriodicity != "" {
		periodicity = ds.Meta.AccrualPeriodicity
	}

	if periodicity == "" {
		return nil, fmt.Errorf("scheduling dataset updates requires a meta component with accrualPeriodicity set")
	}

	name := fmt.Sprintf("%s/%s", ds.Peername, ds.Name)
	workflow, err = scheduler.NewCronWorkflow(name, "ownerID", name, periodicity)
	if err != nil {
		log.Debugw("creating new workflow", "error", err)
		return nil, err
	}
	if ds.Commit != nil {
		workflow.LatestRunStart = &ds.Commit.Timestamp
	}
	if opts != nil {
		workflow.Options = opts
	}
	// err = workflow.Validate()

	return
}

func processWorkflowError(workflow *scheduler.Workflow, errOut *bytes.Buffer, err error) error {
	if err == nil {
		return nil
	}

	// TODO (b5) - this should be a little more stringent :(
	if strings.Contains(errOut.String(), "no changes to save") {
		// TODO (b5) - this should be a concrete error declared in dsfs:
		// dsfs.ErrNoChanges
		return fmt.Errorf("no changes to save")
	}

	return err
}
