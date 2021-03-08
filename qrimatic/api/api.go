package api

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/gorilla/mux"
	golog "github.com/ipfs/go-log"
	"github.com/qri-io/dataset"
	"github.com/qri-io/ioes"
	"github.com/qri-io/qri/lib"
	"github.com/qri-io/qri/transform"
	"github.com/qri-io/qrimatic/scheduler"
	"github.com/qri-io/qrimatic/workflow"
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

	store, err := workflow.NewFileStore(filepath.Join(path, "workflows.json"), inst.Bus())
	if err != nil {
		return nil, err
	}

	// TODO (b5): this will need to be configurable, for now we're restricted to
	// local execution
	factory := newInstanceRunnerFactory(inst)

	svc := scheduler.NewCron(store, factory, inst.Bus())
	log.Debug("starting update service")

	return &Server{
		inst:  inst,
		sched: svc,
	}, nil
}

// AddRoutes registers cron routes with an *http.Mux.
func (s *Server) AddRoutes(m *mux.Router, prefix string, mw func(http.HandlerFunc) http.HandlerFunc) {
	route := func(route string) string {
		return fmt.Sprintf("%s%s", prefix, route)
	}

	s.AddCronRoutes(m, mw)

	// workflow routes
	m.HandleFunc(route("/deploy"), mw(s.DeployHandler))
	m.HandleFunc(route("/undeploy/"), mw(s.UndeployHandler(route("/undeploy/"))))
}

// AddCronRoutes registers cron endpoints on an *http.Mux
func (s *Server) AddCronRoutes(m *mux.Router, mw func(http.HandlerFunc) http.HandlerFunc) {
	m.HandleFunc("/cron", mw(s.StatusHandler))
	m.HandleFunc("/workflows", mw(s.WorkflowsHandler))
	m.HandleFunc("/workflows/trigger", mw(s.WorkflowManualTriggerHandler))
	m.HandleFunc("/collection/running", mw(s.CollectionRunningHandler))
	m.HandleFunc("/collection", mw(s.CollectionHandler))
	m.HandleFunc("/workflow", mw(s.WorkflowHandler))
	m.HandleFunc("/runs", mw(s.RunsHandler))
	m.HandleFunc("/run", mw(s.GetRunInfoHandler))
}

// Start runs the cron service, blocking until an error occurs
func (s *Server) Start(ctx context.Context) error {
	return s.sched.Start(ctx)
}

// newInstanceRunnerFactory returns a factory function that produces a workflow
// runner from a qri instance
func newInstanceRunnerFactory(inst *lib.Instance) func(ctx context.Context) scheduler.RunWorkflowFunc {
	return func(ctx context.Context) scheduler.RunWorkflowFunc {
		dsm := lib.NewDatasetMethods(inst)

		return func(ctx context.Context, streams ioes.IOStreams, w *workflow.Workflow) error {
			runID := transform.NewRunID()

			p := &lib.SaveParams{
				Ref: w.DatasetID,
				Dataset: &dataset.Dataset{
					Commit: &dataset.Commit{
						RunID: runID,
					},
				},
				Apply: true,
			}
			_, err := dsm.Save(ctx, p)
			return err
		}
	}
}

func idFromReq(prefix string, r *http.Request) string {
	path := strings.TrimPrefix(r.URL.Path, prefix)
	path = strings.TrimPrefix(path, "/")
	return path
}
