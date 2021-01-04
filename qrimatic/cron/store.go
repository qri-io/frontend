package cron

import (
	"context"
	"fmt"
	"io"
	"sync"
)

// ErrNotFound represents a lookup miss
var ErrNotFound = fmt.Errorf("not found")

// Store handles the persistence of Jobs and Runs. Store implementations
// must be safe for concurrent use
type Store interface {
	// ListJobs should return the set of jobs sorted in reverse-chronological order
	// (newest first order) of the last time they were run. When two LastRun times
	// are equal, Jobs should alpha sort the names
	// passing a limit of -1 and an offset of 0 returns the entire list of stored
	// jobs
	ListJobs(ctx context.Context, offset, limit int) ([]*Job, error)

	ListRuns(ctx context.Context, offset, limit int) ([]*Run, error)
	// GetJobByName gets a job with the corresponding name field. usually matches
	// the dataset name
	GetJobByName(ctx context.Context, name string) (*Job, error)
	// Job gets a job by it's identifier
	GetJob(ctx context.Context, id string) (*Job, error)
	// PutJob places a job in the store. Putting a job who's name already exists
	// must overwrite the previous job, making all job names unique
	PutJob(context.Context, *Job) error
	// DeleteJob removes a job from the store
	DeleteJob(ctx context.Context, id string) error

	GetRun(ctx context.Context, id string) (*Run, error)
	GetJobRuns(ctx context.Context, jobID string, offset, limit int) ([]*Run, error)
	PutRun(ctx context.Context, r *Run) error
	DeleteAllJobRuns(ctx context.Context, jobID string) error
}

// LogFileCreator is an interface for generating log files to write to,
// Stores should implement this interface
type LogFileCreator interface {
	// CreateLogFile returns a file to write output to
	CreateLogFile(job *Job) (f io.WriteCloser, path string, err error)
}

// MemStore is an in-memory implementation of the Store interface
// Jobs stored in MemStore can be persisted for the duration of a process
// at the longest.
// MemStore is safe for concurrent use
type MemStore struct {
	lock    sync.Mutex
	jobs    *JobSet
	jobRuns map[string]*RunSet
	runs    *RunSet
}

var _ Store = (*MemStore)(nil)

func NewMemStore() *MemStore {
	return &MemStore{
		jobs:    NewJobSet(),
		jobRuns: map[string]*RunSet{},
		runs:    NewRunSet(),
	}
}

// ListJobs lists jobs currently in the store
func (s *MemStore) ListJobs(ctx context.Context, offset, limit int) ([]*Job, error) {
	if limit < 0 {
		limit = len(s.jobs.set)
	}

	jobs := make([]*Job, 0, limit)
	for i, job := range s.jobs.set {
		if i < offset {
			continue
		} else if len(jobs) == limit {
			break
		}

		jobs = append(jobs, job)
	}
	return jobs, nil
}

func (s *MemStore) ListRuns(ctx context.Context, offset, limit int) ([]*Run, error) {
	if limit < 0 {
		limit = len(s.runs.set)
	}

	runs := make([]*Run, 0, limit)
	for i, job := range s.runs.set {
		if i < offset {
			continue
		} else if len(runs) == limit {
			break
		}

		runs = append(runs, job)
	}

	return runs, nil
}

// GetJobByName gets a job with the corresponding name field. usually matches
// the dataset name
func (s *MemStore) GetJobByName(ctx context.Context, name string) (*Job, error) {
	s.lock.Lock()
	defer s.lock.Unlock()

	for _, job := range s.jobs.set {
		if job.Name == name {
			return job.Copy(), nil
		}
	}
	return nil, ErrNotFound
}

// GetJob gets job details from the store by dataset identifier
func (s *MemStore) GetJob(ctx context.Context, id string) (*Job, error) {
	s.lock.Lock()
	defer s.lock.Unlock()

	for _, job := range s.jobs.set {
		if job.ID == id {
			return job.Copy(), nil
		}
	}
	return nil, ErrNotFound
}

// GetDatasetJob gets job details from the store by dataset identifier
func (s *MemStore) GetDatasetJob(ctx context.Context, datasetID string) (*Job, error) {
	s.lock.Lock()
	defer s.lock.Unlock()

	for _, job := range s.jobs.set {
		if job.DatasetID == datasetID {
			return job.Copy(), nil
		}
	}
	return nil, ErrNotFound
}

// PutJob places a job in the store. If the job name matches the name of a job
// that already exists, it will be overwritten with the new job
func (s *MemStore) PutJob(ctx context.Context, job *Job) error {
	if job.ID == "" {
		return fmt.Errorf("ID is required")
	}
	if job.DatasetID == "" {
		return fmt.Errorf("DatasetID is required")
	}

	s.lock.Lock()
	s.jobs.Add(job)
	s.lock.Unlock()

	if job.CurrentRun != nil {
		if err := s.PutRun(ctx, job.CurrentRun); err != nil {
			return err
		}
	}
	return nil
}

// DeleteJob removes a job from the store by name. deleting a non-existent job
// won't return an error
func (s *MemStore) DeleteJob(ctx context.Context, id string) error {
	s.lock.Lock()
	defer s.lock.Unlock()

	if removed := s.jobs.Remove(id); removed {
		return nil
	}
	return ErrNotFound
}

// GetRun fetches a run by ID
func (s *MemStore) GetRun(ctx context.Context, id string) (*Run, error) {
	s.lock.Lock()
	defer s.lock.Unlock()

	for _, r := range s.runs.set {
		if r.ID == id {
			return r.Copy(), nil
		}
	}
	return nil, ErrNotFound
}

func (s *MemStore) GetJobRuns(ctx context.Context, jobID string, offset, limit int) ([]*Run, error) {
	runs, ok := s.jobRuns[jobID]
	if !ok {
		return nil, ErrNotFound
	}

	if limit < 0 {
		return runs.set[offset:], nil
	}

	res := make([]*Run, 0, limit)
	for _, run := range runs.set {
		if offset > 0 {
			offset--
			continue
		}
		if len(res) == limit {
			return res, nil
		}
		res = append(res, run)
	}
	return res, nil
}

func (s *MemStore) PutRun(ctx context.Context, run *Run) error {
	if run.ID == "" {
		return fmt.Errorf("ID is required")
	}
	if run.JobID == "" {
		return fmt.Errorf("JobID is required")
	}

	s.lock.Lock()
	defer s.lock.Unlock()
	if jobRuns, ok := s.jobRuns[run.JobID]; ok {
		jobRuns.Add(run)
	} else {
		jobRuns = NewRunSet()
		jobRuns.Add(run)
		s.jobRuns[run.JobID] = jobRuns
	}
	s.runs.Add(run)
	return nil
}

func (s *MemStore) DeleteAllJobRuns(ctx context.Context, jobID string) error {
	return fmt.Errorf("not finished: MemStore delete all job runs")
}
