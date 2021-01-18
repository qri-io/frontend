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
	"github.com/qri-io/qrimatic/cron"
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
	httpCli := cron.HTTPClient{Addr: cfg.Addr}
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

	var store cron.Store
	switch cfg.Type {
	case "fs":
		store, err = cron.NewFileStore(filepath.Join(path, "cron.json"))
		if err != nil {
			return err
		}
	case "mem":
		store = cron.NewMemStore()
	default:
		return fmt.Errorf("unknown cron type: %q", cfg.Type)
	}

	svc := cron.NewCron(store, Factory, event.NilBus)
	log.Debug("starting update service")
	go func() {
		if err := svc.ServeHTTP(cfg.Addr); err != nil {
			log.Errorf("starting cron http server: %s", err)
		}
	}()

	return svc.Start(ctx)
}

type Service struct {
	inst *lib.Instance
	cron *cron.Cron
}

func NewService(inst *lib.Instance) (*Service, error) {
	path, err := Path(inst.RepoPath())
	if err != nil {
		return nil, err
	}

	var store cron.Store
	// switch cfg.Type {
	// case "fs":
	store, err = cron.NewFileStore(filepath.Join(path, "jobs.json"))
	// case "mem":
	// 	jobStore = cron.NewMemStore()
	// 	logStore = cron.NewMemStore()
	// default:
	// 	return fmt.Errorf("unknown cron type: %q", cfg.Type)
	// }

	svc := cron.NewCron(store, Factory, inst.Bus())
	log.Debug("starting update service")
	// go func() {
	// 	if err := svc.ServeHTTP(cfg.Addr); err != nil {
	// 		log.Errorf("starting cron http server: %s", err)
	// 	}
	// }()

	return &Service{
		inst: inst,
		cron: svc,
	}, nil
}

// AddRoutes registers cron routes with an *http.Mux.
func (s *Service) AddRoutes(m *http.ServeMux, mw func(http.HandlerFunc) http.HandlerFunc) {
	cron.AddCronRoutes(m, s.cron, mw)
}

// Start runs the cron service, blocking until an error occurs
func (s *Service) Start(ctx context.Context) error {
	return s.cron.Start(ctx)
}

// Factory returns a function that can run jobs
func Factory(context.Context) cron.RunJobFunc {
	return func(ctx context.Context, streams ioes.IOStreams, job *cron.Job) error {
		log.Debugf("running update: %s", job.Name)

		var errBuf *bytes.Buffer
		// if the job type is a dataset, error output is semi-predictable
		// write to a buffer for better error reporting
		if job.Type == cron.JTDataset {
			errBuf = &bytes.Buffer{}
			teedErrOut := io.MultiWriter(streams.ErrOut, errBuf)
			streams = ioes.NewIOStreams(streams.In, streams.Out, teedErrOut)
		}

		cmd := JobToCmd(streams, job)
		if cmd == nil {
			return fmt.Errorf("unrecognized update type: %s", job.Type)
		}

		err := cmd.Run()
		return processJobError(job, errBuf, err)
	}
}

// JobToCmd returns an operating system command that will execute the given job
// wiring operating system in/out/errout to the provided iostreams.
func JobToCmd(streams ioes.IOStreams, job *cron.Job) *exec.Cmd {
	switch job.Type {
	case cron.JTDataset:
		return datasetSaveCmd(streams, job)
	case cron.JTShellScript:
		return shellScriptCmd(streams, job)
	default:
		return nil
	}
}

// datasetSaveCmd configures a "qri save" command based on job details
// wiring operating system in/out/errout to the provided iostreams.
func datasetSaveCmd(streams ioes.IOStreams, job *cron.Job) *exec.Cmd {
	args := []string{"save", job.Name}

	if o, ok := job.Options.(*cron.DatasetOptions); ok {
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
func shellScriptCmd(streams ioes.IOStreams, job *cron.Job) *exec.Cmd {
	// TODO (b5) - config and secrets as env vars

	cmd := exec.Command(job.Name)
	cmd.Stderr = streams.ErrOut
	cmd.Stdout = streams.Out
	cmd.Stdin = streams.In
	return cmd
}

// PossibleShellScript checks a path to see if it might be a shell script
// TODO (b5) - deal with platforms that don't use '.sh' as a script extension (windows?)
func PossibleShellScript(path string) bool {
	return filepath.Ext(path) == ".sh"
}

// DatasetToJob converts a dataset to cron.Job
func DatasetToJob(ds *dataset.Dataset, periodicity string, opts *cron.DatasetOptions) (job *cron.Job, err error) {
	if periodicity == "" && ds.Meta != nil && ds.Meta.AccrualPeriodicity != "" {
		periodicity = ds.Meta.AccrualPeriodicity
	}

	if periodicity == "" {
		return nil, fmt.Errorf("scheduling dataset updates requires a meta component with accrualPeriodicity set")
	}

	name := fmt.Sprintf("%s/%s", ds.Peername, ds.Name)
	job, err = cron.NewJob(name, "ownerID", name, cron.JTDataset, periodicity)
	if err != nil {
		log.Debugw("creating new job", "error", err)
		return nil, err
	}
	if ds.Commit != nil {
		job.LatestRunStart = &ds.Commit.Timestamp
	}
	if opts != nil {
		job.Options = opts
	}
	// err = job.Validate()

	return
}

// ShellScriptToJob turns a shell script into cron.Job
func ShellScriptToJob(path string, periodicity string, opts *cron.ShellScriptOptions) (job *cron.Job, err error) {
	// TODO (b5) - confirm file exists & is executable

	job, err = cron.NewJob(path, "foo", path, cron.JTShellScript, periodicity)
	if err != nil {
		return nil, err
	}

	if opts != nil {
		job.Options = opts
	}
	return
}

func processJobError(job *cron.Job, errOut *bytes.Buffer, err error) error {
	if err == nil {
		return nil
	}

	if job.Type == cron.JTDataset && errOut != nil {
		// TODO (b5) - this should be a little more stringent :(
		if strings.Contains(errOut.String(), "no changes to save") {
			// TODO (b5) - this should be a concrete error declared in dsfs:
			// dsfs.ErrNoChanges
			return fmt.Errorf("no changes to save")
		}
	}

	return err
}
