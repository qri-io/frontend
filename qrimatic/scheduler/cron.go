// package scheduler schedules dataset and shell script updates
package scheduler

import (
	"context"
	"fmt"
	"time"

	golog "github.com/ipfs/go-log"
	"github.com/qri-io/ioes"
	"github.com/qri-io/qri/event"
)

var (
	log = golog.Logger("cron")
	// DefaultCheckInterval is the frequency cron will check all stored workflows
	// for scheduled updates without any additional configuration. Qri recommends
	// not running updates more than once an hour for performance and storage
	// consumption reasons, making a check every second reasonable
	DefaultCheckInterval = time.Second
	// NowFunc is an overridable function for getting datestamps
	NowFunc = time.Now
)

func init() {
	golog.SetLogLevel("cron", "debug")
}

// Service is the generic interface for the Cron Scheduler, it's implemented
// by both Cron and HTTPClient for easier RPC communication
type Service interface {
	// ListWorkflows lists currently scheduled workflows
	ListWorkflows(ctx context.Context, offset, limit int) ([]*Workflow, error)
	// WorkflowForName gets a workflow by it's name (which often matches the dataset name)
	WorkflowForName(ctx context.Context, name string) (*Workflow, error)
	// Workflow gets a single scheduled workflow by dataset identifier
	Workflow(ctx context.Context, id string) (*Workflow, error)
	// Runs gives a log of executed workflows
	Runs(ctx context.Context, offset, limit int) ([]*Run, error)
	// GetRun returns a single executed workflow by workflow.LogName
	GetRun(ctx context.Context, id string, runNumber int) (*Run, error)
	// // RunLogFile returns a reader for a file at the given name
	// RunLogFile(ctx context.Context, id string, runNumber int) (io.ReadCloser, error)

	// Schedule adds a workflow to the scheduler for execution
	Schedule(ctx context.Context, workflow *Workflow) error
	// Unschedule removes a workflow from the scheduler
	Unschedule(ctx context.Context, id string) error
}

// RunWorkflowFunc is a function for executing a workflow. Cron takes care of scheduling
// workflow execution, and delegates the work of executing a workflow to a RunWorkflowFunc
// implementation.
type RunTransformFunc func(ctx context.Context, streams ioes.IOStreams, workflow *Workflow) error

// RunWorkflowFactory is a function that returns a runner
type RunWorkflowFactory func(ctx context.Context) (runner RunTransformFunc)

// Cron coordinates the scheduling of running workflows at specified periodicities
// (intervals) with a provided workflow runner function
type Cron struct {
	pub      event.Publisher
	store    Store
	interval time.Duration
	factory  RunWorkflowFactory
}

// assert Cron is a Scheduler at compile time
var _ Service = (*Cron)(nil)

// NewCron creates a Cron with the default check interval
func NewCron(store Store, factory RunWorkflowFactory, pub event.Publisher) *Cron {
	return NewCronInterval(store, factory, pub, DefaultCheckInterval)
}

// NewCronInterval creates a Cron with a check interval
func NewCronInterval(store Store, factory RunWorkflowFactory, pub event.Publisher, checkInterval time.Duration) *Cron {
	return &Cron{
		pub:      pub,
		store:    store,
		interval: checkInterval,
		factory:  factory,
	}
}

// ListWorkflows proxies to the schedule store for reading workflows
func (c *Cron) ListWorkflows(ctx context.Context, offset, limit int) ([]*Workflow, error) {
	return c.store.ListWorkflows(ctx, offset, limit)
}

// WorkflowForName gets a workflow by it's name (which often matches the dataset name)
func (c *Cron) WorkflowForName(ctx context.Context, name string) (*Workflow, error) {
	return c.store.GetWorkflowByName(ctx, name)
}

// Workflow proxies to the schedule store for reading a workflow by name
func (c *Cron) Workflow(ctx context.Context, id string) (*Workflow, error) {
	return c.store.GetWorkflow(ctx, id)
}

// Runs returns a list of workflows that have been executed
func (c *Cron) Runs(ctx context.Context, offset, limit int) ([]*Run, error) {
	return c.store.ListRuns(ctx, offset, limit)
}

// GetRun gives a specific Run by datasetID and run Number
func (c *Cron) GetRun(ctx context.Context, datasetID string, runNumber int) (*Run, error) {
	return nil, fmt.Errorf("not finished: service get run by datasetID and runNumber")
}

// // LogFile returns a reader for a file at the given name
// func (c *Cron) LogFile(ctx context.Context, logName string) (io.ReadCloser, error) {
// 	workflow, err := c.log.Workflow(ctx, logName)
// 	if err != nil {
// 		return nil, err
// 	}

// 	if workflow.LogFilePath == "" {
// 		return ioutil.NopCloser(&bytes.Buffer{}), nil
// 	}

// 	// TODO (b5): if logs are being stored somewhere other than local this'll break
// 	// we should add an OpenLogFile method to LogFileCreator & rename the interface
// 	return os.Open(workflow.LogFilePath)
// }

type execTrigger struct {
	w *Workflow
	t Trigger
}

// Start initiates the check loop, looking for updates to execute once at every
// iteration of the configured check interval.
// Start blocks until the passed context completes
func (c *Cron) Start(ctx context.Context) error {
	check := func(ctx context.Context) {
		now := NowFunc()
		ctx, cleanup := context.WithCancel(ctx)
		defer cleanup()

		workflows, err := c.store.ListWorkflows(ctx, 0, -1)
		if err != nil {
			log.Errorf("getting workflows from store: %s", err)
			return
		}

		run := []execTrigger{}
		for _, workflow := range workflows {
			for _, t := range workflow.Triggers.CronTriggers() {
				if t.NextRunStart != nil && now.After(*t.NextRunStart) {
					run = append(run, execTrigger{
						w: workflow,
						t: t,
					})
				}
				break
			}
		}

		if len(run) > 0 {
			log.Debugw("running workflows", "workflowCount", len(workflows), "runCount", len(run))
			runner := c.factory(ctx)
			for _, r := range run {
				// TODO (b5) - if we want things like per-workflow timeout, we should create
				// a new workflow-scoped context here
				c.runWorkflow(ctx, r.w, r.t, runner)
			}
		}
	}

	t := time.NewTicker(c.interval)
	for {
		select {
		case <-t.C:
			go check(ctx)
		case <-ctx.Done():
			return nil
		}
	}
}

func (c *Cron) runWorkflow(ctx context.Context, workflow *Workflow, t Trigger, runner RunTransformFunc) {
	go func(j *Workflow) {
		if err := c.pub.Publish(ctx, ETWorkflowStarted, j); err != nil {
			log.Debug(err)
		}
	}(workflow.Copy())

	log.Debugf("run workflow: %s", workflow.ID)
	if err := workflow.Advance(); err != nil {
		log.Debugw("advancing workflow", "err", err, "id", workflow.ID)
	}
	if err := t.Advance(); err != nil {
		log.Debugw("advancing trigger", "err", err, "id", t.Info().ID)
	}

	streams := ioes.NewDiscardIOStreams()
	if lfc, ok := c.store.(LogFileCreator); ok {
		if file, logPath, err := lfc.CreateLogFile(workflow); err == nil {
			log.Debugf("using log file: %s", logPath)
			defer file.Close()
			streams = ioes.NewIOStreams(nil, file, file)
			workflow.CurrentRun.LogFilePath = logPath
		}
	}

	if err := runner(ctx, streams, workflow); err != nil {
		log.Errorf("run workflow: %s error: %s", workflow.ID, err.Error())
		workflow.CurrentRun.Error = err.Error()
	} else {
		log.Debugf("run workflow: %s success", workflow.ID)
		workflow.CurrentRun.Error = ""
	}
	now := NowFunc()
	workflow.CurrentRun.Stop = &now
	workflow.LatestRunStart = workflow.CurrentRun.Start

	go func(j *Workflow) {
		if err := c.pub.Publish(ctx, ETWorkflowCompleted, j); err != nil {
			log.Debug(err)
		}
	}(workflow.Copy())

	// the updated workflow that goes to the schedule store shouldn't have a log path
	// scheduleWorkflow := workflow.Copy()
	// scheduleWorkflow.LogFilePath = ""
	// scheduleWorkflow.RunStart = time.Time{}
	// scheduleWorkflow.RunStop = time.Time{}
	// scheduleWorkflow.PrevRunStart = workflow.RunStart
	if err := c.store.PutWorkflow(ctx, workflow); err != nil {
		log.Error(err)
	}

	// workflow.Name = workflow.LogName()
	// if err := c.log.PutWorkflow(ctx, workflow); err != nil {
	// 	log.Error(err)
	// }
}

// Schedule adds a workflow to the cron scheduler
func (c *Cron) Schedule(ctx context.Context, workflow *Workflow) (err error) {
	if workflow.ID == "" && workflow.OwnerID != "" && workflow.DatasetID != "" {
		workflow.ID, err = workflowID(workflow.OwnerID, workflow.DatasetID)
		if err != nil {
			return err
		}
	}

	if !workflow.Disabled {
		for _, t := range workflow.Triggers {
			// give any cron triggers a start time
			if ct, ok := t.(*CronTrigger); ok {
				ct.Start = NowFunc()
				next := ct.Periodicity.After(ct.Start)
				ct.NextRunStart = &next
			}
		}
	}

	if err := c.store.PutWorkflow(ctx, workflow); err != nil {
		return err
	}

	go func(j *Workflow) {
		if err := c.pub.Publish(ctx, ETWorkflowScheduled, j); err != nil {
			log.Debug(err)
		}
	}(workflow.Copy())

	return nil
}

// Unschedule removes a workflow from the cron scheduler, cancelling any future
// workflow executions
func (c *Cron) Unschedule(ctx context.Context, name string) error {
	if err := c.store.DeleteWorkflow(ctx, name); err != nil {
		return err
	}

	go func() {
		if err := c.pub.Publish(ctx, ETWorkflowUnscheduled, name); err != nil {
			log.Debug(err)
		}
	}()

	return nil
}
