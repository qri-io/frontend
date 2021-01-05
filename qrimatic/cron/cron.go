// Package cron schedules dataset and shell script updates
package cron

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
	// DefaultCheckInterval is the frequency cron will check all stored jobs
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
	// ListJobs lists currently scheduled jobs
	ListJobs(ctx context.Context, offset, limit int) ([]*Job, error)
	// JobForName gets a job by it's name (which often matches the dataset name)
	JobForName(ctx context.Context, name string) (*Job, error)
	// Job gets a single scheduled job by dataset identifier
	Job(ctx context.Context, id string) (*Job, error)
	// Runs gives a log of executed jobs
	Runs(ctx context.Context, offset, limit int) ([]*Run, error)
	// GetRun returns a single executed job by job.LogName
	GetRun(ctx context.Context, id string, runNumber int) (*Run, error)
	// // RunLogFile returns a reader for a file at the given name
	// RunLogFile(ctx context.Context, id string, runNumber int) (io.ReadCloser, error)

	// Schedule adds a job to the scheduler for execution
	Schedule(ctx context.Context, job *Job) error
	// Unschedule removes a job from the scheduler
	Unschedule(ctx context.Context, id string) error
}

// RunJobFunc is a function for executing a job. Cron takes care of scheduling
// job execution, and delegates the work of executing a job to a RunJobFunc
// implementation.
type RunJobFunc func(ctx context.Context, streams ioes.IOStreams, job *Job) error

// RunJobFactory is a function that returns a runner
type RunJobFactory func(ctx context.Context) (runner RunJobFunc)

// Cron coordinates the scheduling of running jobs at specified periodicities
// (intervals) with a provided job runner function
type Cron struct {
	pub      event.Publisher
	store    Store
	interval time.Duration
	factory  RunJobFactory
}

// assert Cron is a Scheduler at compile time
var _ Service = (*Cron)(nil)

// NewCron creates a Cron with the default check interval
func NewCron(store Store, factory RunJobFactory, pub event.Publisher) *Cron {
	return NewCronInterval(store, factory, pub, DefaultCheckInterval)
}

// NewCronInterval creates a Cron with a check interval
func NewCronInterval(store Store, factory RunJobFactory, pub event.Publisher, checkInterval time.Duration) *Cron {
	return &Cron{
		pub:      pub,
		store:    store,
		interval: checkInterval,
		factory:  factory,
	}
}

// ListJobs proxies to the schedule store for reading jobs
func (c *Cron) ListJobs(ctx context.Context, offset, limit int) ([]*Job, error) {
	return c.store.ListJobs(ctx, offset, limit)
}

// JobForName gets a job by it's name (which often matches the dataset name)
func (c *Cron) JobForName(ctx context.Context, name string) (*Job, error) {
	return c.store.GetJobByName(ctx, name)
}

// Job proxies to the schedule store for reading a job by name
func (c *Cron) Job(ctx context.Context, id string) (*Job, error) {
	return c.store.GetJob(ctx, id)
}

// Runs returns a list of jobs that have been executed
func (c *Cron) Runs(ctx context.Context, offset, limit int) ([]*Run, error) {
	return c.store.ListRuns(ctx, offset, limit)
}

// GetRun gives a specific Run by datasetID and run Number
func (c *Cron) GetRun(ctx context.Context, datasetID string, runNumber int) (*Run, error) {
	return nil, fmt.Errorf("not finished: service get run by datasetID and runNumber")
}

// // LogFile returns a reader for a file at the given name
// func (c *Cron) LogFile(ctx context.Context, logName string) (io.ReadCloser, error) {
// 	job, err := c.log.Job(ctx, logName)
// 	if err != nil {
// 		return nil, err
// 	}

// 	if job.LogFilePath == "" {
// 		return ioutil.NopCloser(&bytes.Buffer{}), nil
// 	}

// 	// TODO (b5): if logs are being stored somewhere other than local this'll break
// 	// we should add an OpenLogFile method to LogFileCreator & rename the interface
// 	return os.Open(job.LogFilePath)
// }

// Start initiates the check loop, looking for updates to execute once at every
// iteration of the configured check interval.
// Start blocks until the passed context completes
func (c *Cron) Start(ctx context.Context) error {
	check := func(ctx context.Context) {
		now := NowFunc()
		ctx, cleanup := context.WithCancel(ctx)
		defer cleanup()

		jobs, err := c.store.ListJobs(ctx, 0, -1)
		if err != nil {
			log.Errorf("getting jobs from store: %s", err)
			return
		}

		run := []*Job{}
		for _, job := range jobs {
			if job.NextRunStart != nil && now.After(*job.NextRunStart) {
				run = append(run, job)
			}
		}

		if len(run) > 0 {
			log.Debugw("running jobs", "jobCount", len(jobs), "runCount", len(run))
			runner := c.factory(ctx)
			for _, job := range run {
				// TODO (b5) - if we want things like per-job timeout, we should create
				// a new job-scoped context here
				c.runJob(ctx, job, runner)
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

func (c *Cron) runJob(ctx context.Context, job *Job, runner RunJobFunc) {
	go func(j *Job) {
		if err := c.pub.Publish(ctx, event.ETCronJobStarted, j); err != nil {
			log.Debug(err)
		}
	}(job.Copy())

	log.Debugf("run job: %s", job.Name)
	if err := job.Advance(); err != nil {
		log.Debug(err)
	}

	streams := ioes.NewDiscardIOStreams()
	if lfc, ok := c.store.(LogFileCreator); ok {
		if file, logPath, err := lfc.CreateLogFile(job); err == nil {
			log.Debugf("using log file: %s", logPath)
			defer file.Close()
			streams = ioes.NewIOStreams(nil, file, file)
			job.CurrentRun.LogFilePath = logPath
		}
	}

	if err := runner(ctx, streams, job); err != nil {
		log.Errorf("run job: %s error: %s", job.Name, err.Error())
		job.CurrentRun.Error = err.Error()
	} else {
		log.Debugf("run job: %s success", job.Name)
		job.CurrentRun.Error = ""
	}
	now := NowFunc()
	job.CurrentRun.Stop = &now
	job.LatestRunStart = job.CurrentRun.Start

	go func(j *Job) {
		if err := c.pub.Publish(ctx, event.ETCronJobCompleted, j); err != nil {
			log.Debug(err)
		}
	}(job.Copy())

	// the updated job that goes to the schedule store shouldn't have a log path
	// scheduleJob := job.Copy()
	// scheduleJob.LogFilePath = ""
	// scheduleJob.RunStart = time.Time{}
	// scheduleJob.RunStop = time.Time{}
	// scheduleJob.PrevRunStart = job.RunStart
	if err := c.store.PutJob(ctx, job); err != nil {
		log.Error(err)
	}

	// job.Name = job.LogName()
	// if err := c.log.PutJob(ctx, job); err != nil {
	// 	log.Error(err)
	// }
}

// Schedule adds a job to the cron scheduler
func (c *Cron) Schedule(ctx context.Context, job *Job) (err error) {
	if job.ID == "" && job.OwnerID != "" && job.DatasetID != "" {
		job.ID, err = jobID(job.OwnerID, job.DatasetID)
		if err != nil {
			return err
		}
	}

	if !job.Paused && job.NextRunStart == nil {
		next := job.Periodicity.After(NowFunc())
		job.NextRunStart = &next
	}

	if err := c.store.PutJob(ctx, job); err != nil {
		return err
	}

	go func(j *Job) {
		if err := c.pub.Publish(ctx, event.ETCronJobScheduled, j); err != nil {
			log.Debug(err)
		}
	}(job.Copy())

	return nil
}

// Unschedule removes a job from the cron scheduler, cancelling any future
// job executions
func (c *Cron) Unschedule(ctx context.Context, name string) error {
	if err := c.store.DeleteJob(ctx, name); err != nil {
		return err
	}

	go func() {
		if err := c.pub.Publish(ctx, event.ETCronJobUnscheduled, name); err != nil {
			log.Debug(err)
		}
	}()

	return nil
}
