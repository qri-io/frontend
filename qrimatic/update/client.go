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
	"github.com/qri-io/qrimatic/cron"
)

// Client enapsulates logic for scheduled updates
type Client struct {
	repoPath string
	sch      cron.Service
}

// NewClient creates a new HTTP client from an address
func NewClient(repoPath string) (*Client, error) {
	cfg, err := config.ReadFromFile(filepath.Join(repoPath, "config.yaml"))
	if err != nil {
		return nil, err
	}
	return &Client{
		repoPath: repoPath,
		sch:      cron.HTTPClient{Addr: cfg.API.Address},
	}, nil
}

// Job aliases a cron.Job, removing the need to import the cron package.
type Job = cron.Job

// Run aliase a cron.Run, removing the need to import the cron package.
type Run = cron.Run

// ScheduleParams encapsulates parameters for scheduling updates
type ScheduleParams struct {
	Name        string
	Periodicity string
	RepoPath    string

	// SaveParams only applies to dataset saves
	SaveParams *lib.SaveParams
}

// Schedule creates a job and adds it to the scheduler
func (c *Client) Schedule(ctx context.Context, in *ScheduleParams, out *cron.Job) (err error) {
	// Make all paths absolute. this must happen *before* any possible RPC call
	if PossibleShellScript(in.Name) {
		if err = qfs.AbsPath(&in.Name); err != nil {
			return
		}
	}

	if err = in.SaveParams.AbsolutizePaths(); err != nil {
		return err
	}

	job, err := c.jobFromScheduleParams(ctx, in)
	if err != nil {
		log.Debugw("creating job from schedule params", "error", err)
		return err
	}

	log.Debugw("scheduling job", "job", job)
	if err = c.sch.Schedule(ctx, job); err != nil {
		log.Debugw("scheduling job", "error", err)
		return err
	}

	*out = *job
	return nil
}

func (c *Client) jobFromScheduleParams(ctx context.Context, p *ScheduleParams) (job *cron.Job, err error) {
	if PossibleShellScript(p.Name) {
		return ShellScriptToJob(p.Name, p.Periodicity, nil)
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

	var o *cron.DatasetOptions
	if p.SaveParams != nil {
		o = &cron.DatasetOptions{
			Title:               p.SaveParams.Title,
			Message:             p.SaveParams.Message,
			BodyPath:            p.SaveParams.BodyPath,
			FilePaths:           p.SaveParams.FilePaths,
			Force:               p.SaveParams.Force,
			ConvertFormatToPrev: p.SaveParams.ConvertFormatToPrev,
			ShouldRender:        p.SaveParams.ShouldRender,
			Secrets:             p.SaveParams.Secrets,
		}
	}

	return DatasetToJob(res.Dataset, p.Periodicity, o)
}

// Unschedule removes a job from the scheduler by name
func (c *Client) Unschedule(ctx context.Context, name *string, unscheduled *bool) error {
	return c.sch.Unschedule(ctx, *name)
}

// List gets scheduled jobs
func (c *Client) List(ctx context.Context, p *lib.ListParams, jobs *[]*Job) error {
	list, err := c.sch.ListJobs(ctx, p.Offset, p.Limit)
	if err != nil {
		log.Debugw("listing jobs", "error", err)
		return err
	}
	*jobs = list
	return nil
}

// Job gets a job by name
func (c *Client) Job(ctx context.Context, name *string, job *Job) error {
	res, err := c.sch.Job(ctx, *name)
	if err != nil {
		return err
	}

	*job = *res
	return nil
}

// Runs shows the history of job execution
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
func (c *Client) Run(ctx context.Context, p *Job, res *reporef.DatasetRef) (err error) {
	// Make all paths absolute. this must happen *before* any possible RPC call
	if PossibleShellScript(p.Name) {
		if err = qfs.AbsPath(&p.Name); err != nil {
			return
		}
		p.Type = cron.JTShellScript
	} else {
		p.Type = cron.JTDataset
	}

	if err := absolutizeJobFilepaths(p); err != nil {
		return err
	}

	switch p.Type {
	case cron.JTDataset:
		params := &lib.SaveParams{
			Ref: p.Name,
		}
		if o, ok := p.Options.(*cron.DatasetOptions); ok {
			params = &lib.SaveParams{
				Ref:                 p.Name,
				Title:               o.Title,
				Message:             o.Message,
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

	case cron.JTShellScript:
		// err = JobToCmd(m.inst.streams, p).Run()
		err = JobToCmd(ioes.NewStdIOStreams(), p).Run()
	case cron.JobType(""):
		return fmt.Errorf("update requires a job type to run")
	default:
		return fmt.Errorf("unrecognized update type: %s", p.Type)
	}

	if err != nil {
		return err
	}

	// if p.RunError == "" {
	// 	err = m.inst.Repo().Logbook().WriteCronJobRan(ctx, p.RunNumber, reporef.ConvertToDsref(*res))
	// }
	return err
}

func absolutizeJobFilepaths(j *Job) error {
	if o, ok := j.Options.(*cron.DatasetOptions); ok {
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
