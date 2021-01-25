package scheduler

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"sync"
)

// FileStore is a jobstore implementation that writeToFiles to a file of
// JSON bytes.
// FileStore is safe for concurrent use
type FileStore struct {
	path string

	lock    sync.Mutex
	jobs    *JobSet
	jobRuns map[string]*RunSet
	runs    *RunSet
}

// compile-time assertion that FileStore is a Store
var _ Store = (*FileStore)(nil)

// NewFileStore creates a job store that persists to a file
func NewFileStore(path string) (Store, error) {
	s := &FileStore{
		path:    path,
		jobs:    NewJobSet(),
		jobRuns: map[string]*RunSet{},
		runs:    NewRunSet(),
	}

	log.Debugw("creating file store")
	return s, s.loadFromFile()
}

// ListJobs lists jobs currently in the store
func (s *FileStore) ListJobs(ctx context.Context, offset, limit int) ([]*Job, error) {
	s.lock.Lock()
	defer s.lock.Unlock()

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

func (s *FileStore) ListRuns(ctx context.Context, offset, limit int) ([]*Run, error) {
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
func (s *FileStore) GetJobByName(ctx context.Context, name string) (*Job, error) {
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
func (s *FileStore) GetJob(ctx context.Context, id string) (*Job, error) {
	s.lock.Lock()
	defer s.lock.Unlock()

	for _, job := range s.jobs.set {
		if job.ID == id {
			return job.Copy(), nil
		}
	}
	return nil, ErrNotFound
}

// PutJob places a job in the store. If the job name matches the name of a job
// that already exists, it will be overwritten with the new job
func (s *FileStore) PutJob(ctx context.Context, job *Job) error {
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
	return s.writeToFile()
}

// DeleteJob removes a job from the store by name. deleting a non-existent job
// won't return an error
func (s *FileStore) DeleteJob(ctx context.Context, id string) error {
	s.lock.Lock()
	defer s.lock.Unlock()

	if removed := s.jobs.Remove(id); removed {
		return s.writeToFile()
	}
	return ErrNotFound
}

// GetRun fetches a run by ID
func (s *FileStore) GetRun(ctx context.Context, id string) (*Run, error) {
	s.lock.Lock()
	defer s.lock.Unlock()

	for _, r := range s.runs.set {
		if r.ID == id {
			return r.Copy(), nil
		}
	}
	return nil, ErrNotFound
}

func (s *FileStore) GetJobRuns(ctx context.Context, jobID string, offset, limit int) ([]*Run, error) {
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

func (s *FileStore) PutRun(ctx context.Context, run *Run) error {
	if run.ID == "" {
		return fmt.Errorf("ID is required")
	}
	if run.JobID == "" {
		return fmt.Errorf("JobID is required")
	}

	s.lock.Lock()
	if jobRuns, ok := s.jobRuns[run.JobID]; ok {
		jobRuns.Add(run)
	} else {
		jobRuns = NewRunSet()
		jobRuns.Add(run)
		s.jobRuns[run.JobID] = jobRuns
	}
	s.runs.Add(run)
	s.lock.Unlock()
	return s.writeToFile()
}

func (s *FileStore) DeleteAllJobRuns(ctx context.Context, jobID string) error {
	return fmt.Errorf("not finished: FileStore delete all job runs")
}

// const logsDirName = "logfiles"

// // CreateLogFile creates a log file in the specified logs directory
// func (s *FileStore) CreateLogFile(j *Job) (f io.WriteCloser, path string, err error) {
// 	s.lock.Lock()
// 	defer s.lock.Unlock()

// 	var logsDir string
// 	if logsDir, err = s.logsDir(); err != nil {
// 		return
// 	}
// 	path = filepath.Join(logsDir, j.LogName()+".log")

// 	f, err = os.OpenFile(path, os.O_APPEND|os.O_WRONLY|os.O_CREATE, 0644)
// 	return
// }

// func (s *FileStore) logsDir() (string, error) {
// 	path := filepath.Join(filepath.Dir(s.path), logsDirName)
// 	err := os.MkdirAll(path, os.ModePerm)
// 	return path, err
// }

// // Destroy removes the path entirely
// func (s *FileStore) Destroy() error {
// 	os.RemoveAll(filepath.Join(filepath.Dir(s.path), logsDirName))
// 	return os.Remove(s.path)
// }

func (s *FileStore) loadFromFile() (err error) {
	s.lock.Lock()
	defer s.lock.Unlock()

	data, err := ioutil.ReadFile(s.path)
	if err != nil {
		if os.IsNotExist(err) {
			return nil
		}
		log.Debugw("FileStore loading store from file", "error", err)
		return err
	}

	state := struct {
		Jobs    *JobSet
		JobRuns map[string]*RunSet
		Runs    *RunSet
	}{}
	if err := json.Unmarshal(data, &state); err != nil {
		log.Debugw("FileStore deserializing from JSON", "error", err)
		return err
	}

	if state.Jobs != nil {
		s.jobs = state.Jobs
	}
	if state.JobRuns != nil {
		s.jobRuns = state.JobRuns
	}
	if state.Runs != nil {
		s.runs = state.Runs
	}
	return nil
}

func (s *FileStore) writeToFile() error {
	s.lock.Lock()
	defer s.lock.Unlock()

	state := struct {
		Jobs    *JobSet
		JobRuns map[string]*RunSet
		Runs    *RunSet
	}{
		Jobs:    s.jobs,
		JobRuns: s.jobRuns,
		Runs:    s.runs,
	}
	data, err := json.Marshal(state)
	if err != nil {
		return err
	}
	return ioutil.WriteFile(s.path, data, 0644)
}
