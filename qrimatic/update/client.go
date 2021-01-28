package update

import (
	"context"
	"fmt"
	"path/filepath"
	"time"

	"github.com/qri-io/ioes"
	"github.com/qri-io/qfs"
	"github.com/qri-io/qri/config"
	"github.com/qri-io/qri/lib"
	reporef "github.com/qri-io/qri/repo/ref"
	qmapi "github.com/qri-io/qrimatic/api"
	"github.com/qri-io/qrimatic/scheduler"
)

// Client enapsulates logic for scheduled updates
type Client struct {
	repoPath string
	sch      scheduler.Service
}

// NewClient creates a new HTTP client from an address
func NewClient(repoPath string) (*Client, error) {
	cfg, err := config.ReadFromFile(filepath.Join(repoPath, "config.yaml"))
	if err != nil {
		return nil, err
	}
	return &Client{
		repoPath: repoPath,
		sch:      scheduler.HTTPClient{Addr: cfg.API.Address},
	}, nil
}

// Workflow aliases a scheduler.Workflow, removing the need to import the cron package.
type Workflow = scheduler.Workflow

// Run aliase a scheduler.Run, removing the need to import the cron package.
type Run = scheduler.Run

// ScheduleParams encapsulates parameters for scheduling updates
type ScheduleParams struct {
	Name        string
	Periodicity string
	RepoPath    string

	// SaveParams only applies to dataset saves
	SaveParams *lib.SaveParams
}

// Schedule creates a workflow and adds it to the scheduler
func (c *Client) Schedule(ctx context.Context, in *ScheduleParams, out *scheduler.Workflow) (err error) {
	// Make all paths absolute. this must happen *before* any possible RPC call
	if PossibleShellScript(in.Name) {
		if err = qfs.AbsPath(&in.Name); err != nil {
			return
		}
	}

	if err = in.SaveParams.AbsolutizePaths(); err != nil {
		return err
	}

	workflow, err := c.workflowFromScheduleParams(ctx, in)
	if err != nil {
		log.Debugw("creating workflow from schedule params", "error", err)
		return err
	}

	log.Debugw("scheduling workflow", "workflow", workflow)
	if err = c.sch.Schedule(ctx, workflow); err != nil {
		log.Debugw("scheduling workflow", "error", err)
		return err
	}

	*out = *workflow
	return nil
}

func (c *Client) workflowFromScheduleParams(ctx context.Context, p *ScheduleParams) (workflow *scheduler.Workflow, err error) {
	if PossibleShellScript(p.Name) {
		return ShellScriptToWorkflow(p.Name, p.Periodicity, nil)
	}

	// TODO (b5) - finish
	inst, err := lib.NewInstance(ctx, c.repoPath)
	if err != nil {
		log.Debugw("creating new instance to resolve ref")
		return nil, err
	}
	res := &lib.GetResult{}
	if err := lib.NewDatasetMethods(inst).Get(&lib.GetParams{Refstr: p.Name}, res); err != nil {
		log.Debugw("resolving dataset", "error", err)
		return nil, err
	}

	var o *scheduler.DatasetOptions
	if p.SaveParams != nil {
		o = &scheduler.DatasetOptions{
			Title:   p.SaveParams.Title,
			Message: p.SaveParams.Message,
			// TODO (arqu): revert once implemented
			// Recall:              p.SaveParams.Recall,
			BodyPath:            p.SaveParams.BodyPath,
			FilePaths:           p.SaveParams.FilePaths,
			Force:               p.SaveParams.Force,
			ConvertFormatToPrev: p.SaveParams.ConvertFormatToPrev,
			ShouldRender:        p.SaveParams.ShouldRender,
			Secrets:             p.SaveParams.Secrets,
		}
	}

	return DatasetToWorkflow(res.Dataset, p.Periodicity, o)
}

// Unschedule removes a workflow from the scheduler by name
func (c *Client) Unschedule(ctx context.Context, name *string, unscheduled *bool) error {
	return c.sch.Unschedule(ctx, *name)
}

// List gets scheduled workflows
func (c *Client) List(ctx context.Context, p *lib.ListParams, workflows *[]*Workflow) error {
	list, err := c.sch.ListWorkflows(ctx, p.Offset, p.Limit)
	if err != nil {
		log.Debugw("listing workflows", "error", err)
		return err
	}
	*workflows = list
	return nil
}

// Workflow gets a workflow by name
func (c *Client) Workflow(ctx context.Context, name *string, workflow *Workflow) error {
	res, err := c.sch.Workflow(ctx, *name)
	if err != nil {
		return err
	}

	*workflow = *res
	return nil
}

// Runs shows the history of workflow execution
func (c *Client) Runs(ctx context.Context, p *lib.ListParams, res *[]*Run) error {
	runs, err := c.sch.Runs(ctx, p.Offset, p.Limit)
	if err != nil {
		return err
	}

	*res = runs
	return nil
}

// // LogFile reads log file data for a given logName
// func (c *Client) LogFile(ctx context.Context, logName *string, data *[]byte) error {
// 	f, err := c.sch.LogFile(ctx, *logName)
// 	if err != nil {
// 		return err
// 	}

// 	defer f.Close()
// 	res, err := ioutil.ReadAll(f)
// 	*data = res

// 	return err
// }

// ServiceStatus describes the current state of a service
type ServiceStatus struct {
	Name       string
	Running    bool
	Daemonized bool // if true this service is scheduled
	Started    *time.Time
	Address    string
	Metrics    map[string]interface{}
}

// ServiceStatus reports status of the update daemon
func (c *Client) ServiceStatus(in *bool, out *ServiceStatus) error {
	// res, err := Status()
	// if err != nil {
	// 	return err
	// }

	// *out = ServiceStatus{
	// 	Name: res,
	// }
	return nil
}

// // ServiceStartParams configures startup
// type ServiceStartParams struct {
// 	Ctx       context.Context
// 	Daemonize bool

// 	// TODO (b5): I'm really not a fan of passing these configuration-derived
// 	// bits as parameters. Ideally this would come from the underlying instance
// 	// these are needed because lib.NewInstance creates a cron client
// 	// that intereferes with the start service process. We're currently getting
// 	// around this by avoiding calls to lib.NewInstance, or passing in resulting
// 	// params when called. We should clean this up.
// 	RepoPath  string
// 	UpdateCfg *config.Update
// }

// // ServiceStart ensures the scheduler is running
// func (m *Client) ServiceStart(p *ServiceStartParams, started *bool) error {
// 	// TODO (b5) - these work when the API is running
// 	if p.RepoPath == "" && m.inst != nil {
// 		p.RepoPath = m.inst.RepoPath()
// 	}
// 	if p.UpdateCfg == nil && m.inst != nil {
// 		p.UpdateCfg = m.inst.Config().Update
// 	}

// 	if !p.Daemonize {
// 		log.Info("starting update service")
// 	}

// 	*started = true
// 	return Start(p.Ctx, p.RepoPath, p.UpdateCfg, p.Daemonize)
// }

// // ServiceStop halts the scheduler
// func (m *Client) ServiceStop(in, out *bool) error {
// 	*out = true
// 	return StopDaemon(m.inst.RepoPath())
// }

// // ServiceRestart uses shell commands to restart the scheduler service
// func (m *Client) ServiceRestart(in, out *bool) error {
// 	// TODO (b5):
// 	return fmt.Errorf("not finished")
// }

// Run advances a dataset to the latest known version from either a peer or by
// re-running a transform in the peer's namespace
func (c *Client) Run(ctx context.Context, p *Workflow, res *reporef.DatasetRef) (err error) {
	// Make all paths absolute. this must happen *before* any possible RPC call
	if PossibleShellScript(p.Name) {
		if err = qfs.AbsPath(&p.Name); err != nil {
			return
		}
		p.Type = scheduler.JTShellScript
	} else {
		p.Type = scheduler.JTDataset
	}

	if err := absolutizeWorkflowFilepaths(p); err != nil {
		return err
	}

	switch p.Type {
	case scheduler.JTDataset:
		params := &lib.SaveParams{
			Ref: p.Name,
		}
		if o, ok := p.Options.(*scheduler.DatasetOptions); ok {
			params = &lib.SaveParams{
				Ref:     p.Name,
				Title:   o.Title,
				Message: o.Message,
				// TODO (arqu): revert once implemented
				// Recall:              o.Recall,
				BodyPath:            o.BodyPath,
				FilePaths:           o.FilePaths,
				Force:               o.Force,
				ConvertFormatToPrev: o.ConvertFormatToPrev,
				ShouldRender:        o.ShouldRender,
				Secrets:             o.Secrets,

				// TODO (b5) not fully supported yet:
				// Strict: o.Strict,
				// Config: o.Config
			}
		}
		*res = reporef.DatasetRef{}
		err = c.runDatasetUpdate(ctx, params, res)

	case scheduler.JTShellScript:
		// err = WorkflowToCmd(m.inst.streams, p).Run()
		err = qmapi.WorkflowToCmd(ioes.NewStdIOStreams(), p).Run()
	case scheduler.WorkflowType(""):
		return fmt.Errorf("update requires a workflow type to run")
	default:
		return fmt.Errorf("unrecognized update type: %s", p.Type)
	}

	if err != nil {
		return err
	}

	// if p.RunError == "" {
	// 	err = m.inst.Repo().Logbook().WriteCronWorkflowRan(ctx, p.RunNumber, reporef.ConvertToDsref(*res))
	// }
	return err
}

func absolutizeWorkflowFilepaths(j *Workflow) error {
	if o, ok := j.Options.(*scheduler.DatasetOptions); ok {
		if err := qfs.AbsPath(&o.BodyPath); err != nil {
			return err
		}
		for i := range o.FilePaths {
			if err := qfs.AbsPath(&o.FilePaths[i]); err != nil {
				return err
			}
		}
	}
	return nil
}

func (c *Client) runDatasetUpdate(ctx context.Context, p *lib.SaveParams, res *reporef.DatasetRef) error {
	// ref, err := repo.ParseDatasetRef(p.Ref)
	// if err != nil {
	// 	return err
	// }

	// if err = repo.CanonicalizeDatasetRef(c.inst.node.Repo, &ref); err == repo.ErrNotFound {
	// 	return fmt.Errorf("unknown dataset '%s'. please add before updating", ref.AliasString())
	// } else if err != nil {
	// 	return err
	// }

	// if !base.InLocalNamespace(m.inst.Repo(), &ref) {
	// 	// TODO (b5) - add remoteclient.Update method
	// 	return fmt.Errorf("remote updating is currently disabled")
	// }

	// // default to recalling transform scripts for local updates
	// // TODO (b5): not sure if this should be here or in client libraries
	// if p.Recall == "" {
	// 	p.Recall = "tf"
	// }

	// dsr := NewDatasetRequestsInstance(m.inst)
	// return dsr.Save(p, res)
	return fmt.Errorf("unfinished")
}
