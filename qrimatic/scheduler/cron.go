package scheduler

import (
	"context"
	"fmt"
	"sync"
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
	// Workflow gets a single scheduled workflow by workflow identifier
	Workflow(ctx context.Context, id string) (*Workflow, error)
	// WorkflowForDataset gets a single scheduled workflow by dataset identifier
	WorkflowForDataset(ctx context.Context, id string) (*Workflow, error)
	// Runs gives a log of executed workflows
	Runs(ctx context.Context, offset, limit int) ([]*RunInfo, error)
	// GetRun returns a single executed workflow by workflow.LogName
	GetRun(ctx context.Context, id string, runNumber int) (*RunInfo, error)
	// // RunLogFile returns a reader for a file at the given name
	// RunLogFile(ctx context.Context, id string, runNumber int) (io.ReadCloser, error)

	// Schedule adds a workflow to the scheduler for execution
	Schedule(ctx context.Context, workflow *Workflow) error
	// Unschedule removes a workflow from the scheduler
	Unschedule(ctx context.Context, id string) error
	// UpdateWorkflow
	UpdateWorkflow(ctx context.Context, workflow *Workflow) error
}

// RunWorkflowFunc is a function for executing a workflow. Cron takes care of scheduling
// workflow execution, and delegates the work of executing a workflow to a RunWorkflowFunc
// implementation.
type RunWorkflowFunc func(ctx context.Context, streams ioes.IOStreams, workflow *Workflow) error

// RunWorkflowFactory is a function that returns a runner
type RunWorkflowFactory func(ctx context.Context) (runner RunWorkflowFunc)

// Cron coordinates the scheduling of running workflows at specified periodicities
// (intervals) with a provided workflow runner function
type Cron struct {
	pub      event.Publisher
	store    Store
	interval time.Duration
	factory  RunWorkflowFactory

	runLk sync.Mutex
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

// ListWorkflowsByStatus proxies to the scheudler store for reading workflows by status
// returns workflows is reverse chronological order by `LatestStart`
func (c *Cron) ListWorkflowsByStatus(ctx context.Context, status string, offset, limit int) ([]*Workflow, error) {
	return c.store.ListWorkflowsByStatus(ctx, status, offset, limit)
}

// WorkflowForName gets a workflow by it's name (which often matches the dataset name)
func (c *Cron) WorkflowForName(ctx context.Context, name string) (*Workflow, error) {
	return c.store.GetWorkflowByName(ctx, name)
}

// Workflow proxies to the schedule store for reading a workflow by name
func (c *Cron) Workflow(ctx context.Context, id string) (*Workflow, error) {
	return c.store.GetWorkflow(ctx, id)
}

// WorkflowForDataset gets a single scheduled workflow by dataset identifier
func (c *Cron) WorkflowForDataset(ctx context.Context, id string) (*Workflow, error) {
	return c.store.GetWorkflowByDatasetID(ctx, id)
}

// Runs returns a list of workflows that have been executed
func (c *Cron) Runs(ctx context.Context, offset, limit int) ([]*RunInfo, error) {
	return c.store.ListRuns(ctx, offset, limit)
}

// GetRun gives a specific Run by datasetID and run Number
func (c *Cron) GetRun(ctx context.Context, datasetID string, runNumber int) (*RunInfo, error) {
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

		run := []*Workflow{}
		trigger := []Trigger{}
		for _, workflow := range workflows {
			if workflow.Disabled {
				log.Debugf("workflow disabled: %q", workflow.ID)
				continue
			}
			for _, t := range workflow.Triggers {
				if t.Info().Disabled {
					log.Debugf("trigger disabled: %q", t.Info().ID)
					continue
				}
				// TODO (arqu): handle other trigger types
				switch t.Info().Type {
				case TTCron:
					crn := t.(*CronTrigger)
					if crn.NextRunStart != nil && now.After(*crn.NextRunStart) {
						run = append(run, workflow)
						trigger = append(trigger, t)
					}
				default:
					log.Debugf("trigger type not implemented: %q", t.Info().Type)
				}
			}
		}

		if len(run) > 0 {
			log.Debugw("running workflows", "workflowCount", len(workflows), "runCount", len(run))
			for i, workflow := range run {
				// TODO (b5) - if we want things like per-workflow timeout, we should create
				// a new workflow-scoped context here
				c.RunWorkflow(ctx, workflow, trigger[i].Info().ID)
			}
		}
	}

	t := time.NewTicker(c.interval)
	for {
		select {
		case <-t.C:
			// TODO(b5): running these checks in a goroutine kicks off major issues when
			// running dataset updates. If multiple updates are scheduled in a tight loop
			// two writes can kick off at the same time, causing all sorts of undefiend
			// behaviour. We can only restore this goroutine once a qri instance is deemed
			// safe for concurrent use
			// go check(ctx)
			check(ctx)
		case <-ctx.Done():
			return nil
		}
	}
}

// RunWorkflow runs and updates the workflow
// It emits `ETWorkflowStarted` and `ETWorkflowCompleted` events with the updated
// workflow events. It is not responsible for storing the resultant workflow.
func (c *Cron) RunWorkflow(ctx context.Context, workflow *Workflow, triggerID string) {
	c.runLk.Lock()
	defer c.runLk.Unlock()

	runner := c.factory(ctx)

	log.Debugf("run workflow: %s", workflow.Name)
	if err := workflow.Advance(triggerID); err != nil {
		log.Debug(err)
	}

	go func(j *Workflow) {
		if err := c.pub.Publish(ctx, ETWorkflowStarted, j); err != nil {
			log.Debug(err)
		}
	}(workflow.Copy())

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
		log.Errorf("run workflow: %s error: %s", workflow.Name, err.Error())
		workflow.CurrentRun.Error = err.Error()
		workflow.Status = StatusFailed
	} else {
		log.Debugf("run workflow: %s success", workflow.Name)
		workflow.CurrentRun.Error = ""
		workflow.Status = StatusSucceeded
	}
	now := NowFunc()
	workflow.CurrentRun.Stop = &now
	workflow.LatestEnd = &now

	go func(j *Workflow) {
		if err := c.pub.Publish(ctx, ETWorkflowCompleted, j); err != nil {
			log.Debug(err)
		}
	}(workflow.Copy())
}

// Schedule adds a workflow to the cron scheduler
func (c *Cron) Schedule(ctx context.Context, workflow *Workflow) (err error) {

	// ensure IDs are aligned to avoid double workflows/scheduling
	wf, err := c.store.GetWorkflowByDatasetID(ctx, workflow.DatasetID)
	if err == nil && (workflow.ID == "" || workflow.ID != wf.ID) {
		return fmt.Errorf("schedule: bad workflow ID")
	}

	if workflow.ID == "" && workflow.OwnerID != "" && workflow.DatasetID != "" {
		workflow.ID = workflowID()
	}

	// if we're scheduling a workflow, it means it's enabled
	workflow.Disabled = false

	for _, t := range workflow.Triggers {
		if t.Info().Disabled {
			log.Debugf("trigger disabled: %q", t.Info().ID)
			continue
		}
		// TODO (arqu): handle other trigger types
		switch t.Info().Type {
		case TTCron:
			crn := t.(*CronTrigger)
			if crn.NextRunStart == nil {
				crn.NextRunStart = crn.NextExecutionWall()
			}
		default:
			log.Debugf("trigger type not implemented: %q", t.Info().Type)
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
func (c *Cron) Unschedule(ctx context.Context, id string) error {
	// TODO(arqu): this should also remove associated runs
	if err := c.store.DeleteWorkflow(ctx, id); err != nil {
		return err
	}
	go func() {
		if err := c.pub.Publish(ctx, ETWorkflowUnscheduled, id); err != nil {
			log.Debug(err)
		}
	}()

	return nil
}

func (c *Cron) UpdateWorkflow(ctx context.Context, workflow *Workflow) error {
	if workflow == nil {
		return fmt.Errorf("workflow is nil")
	}
	if workflow.ID == "" {
		return fmt.Errorf("bad workflow ID")
	}
	wf, err := c.store.GetWorkflow(ctx, workflow.ID)
	if err != nil {
		return err
	}

	wf.Disabled = workflow.Disabled
	wf.Triggers = workflow.Triggers
	wf.OnComplete = workflow.OnComplete

	if err := c.store.PutWorkflow(ctx, wf); err != nil {
		return err
	}
	go func() {
		if err := c.pub.Publish(ctx, ETWorkflowUpdated, wf.ID); err != nil {
			log.Debug(err)
		}
	}()

	return nil
}
