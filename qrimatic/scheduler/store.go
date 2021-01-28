package scheduler

import (
	"context"
	"fmt"
	"io"
	"sync"
)

// ErrNotFound represents a lookup miss
var ErrNotFound = fmt.Errorf("not found")

// Store handles the persistence of Workflows and Runs. Store implementations
// must be safe for concurrent use
type Store interface {
	// ListWorkflows should return the set of workflows sorted in reverse-chronological
	// order (newest first order) of the last time they were run. When two LastRun
	// times are equal, Workflows should alpha sort the names
	// passing a limit of -1 and an offset of 0 returns the entire list of stored
	// workflows
	ListWorkflows(ctx context.Context, offset, limit int) ([]*Workflow, error)

	ListRuns(ctx context.Context, offset, limit int) ([]*Run, error)
	// GetWorkflowByName gets a workflow with the corresponding name field. usually matches
	// the dataset name
	GetWorkflowByName(ctx context.Context, name string) (*Workflow, error)
	// GetWorkflowByDatasetID gets a workflow with the corresponding datasetID field
	GetWorkflowByDatasetID(ctx context.Context, datasetID string) (*Workflow, error)
	// Workflow gets a workflow by it's identifier
	GetWorkflow(ctx context.Context, id string) (*Workflow, error)
	// PutWorkflow places a workflow in the store. Putting a workflow who's name already exists
	// must overwrite the previous workflow, making all workflow names unique
	PutWorkflow(context.Context, *Workflow) error
	// DeleteWorkflow removes a workflow from the store
	DeleteWorkflow(ctx context.Context, id string) error

	GetRun(ctx context.Context, id string) (*Run, error)
	GetWorkflowRuns(ctx context.Context, workflowID string, offset, limit int) ([]*Run, error)
	PutRun(ctx context.Context, r *Run) error
	DeleteAllWorkflowRuns(ctx context.Context, workflowID string) error
}

// LogFileCreator is an interface for generating log files to write to,
// Stores should implement this interface
type LogFileCreator interface {
	// CreateLogFile returns a file to write output to
	CreateLogFile(workflow *Workflow) (f io.WriteCloser, path string, err error)
}

// MemStore is an in-memory implementation of the Store interface
// Workflows stored in MemStore can be persisted for the duration of a process
// at the longest.
// MemStore is safe for concurrent use
type MemStore struct {
	lock         sync.Mutex
	workflows    *WorkflowSet
	workflowRuns map[string]*RunSet
	runs         *RunSet
}

var _ Store = (*MemStore)(nil)

func NewMemStore() *MemStore {
	return &MemStore{
		workflows:    NewWorkflowSet(),
		workflowRuns: map[string]*RunSet{},
		runs:         NewRunSet(),
	}
}

// ListWorkflows lists workflows currently in the store
func (s *MemStore) ListWorkflows(ctx context.Context, offset, limit int) ([]*Workflow, error) {
	if limit < 0 {
		limit = len(s.workflows.set)
	}

	workflows := make([]*Workflow, 0, limit)
	for i, workflow := range s.workflows.set {
		if i < offset {
			continue
		} else if len(workflows) == limit {
			break
		}

		workflows = append(workflows, workflow)
	}
	return workflows, nil
}

func (s *MemStore) ListRuns(ctx context.Context, offset, limit int) ([]*Run, error) {
	if limit < 0 {
		limit = len(s.runs.set)
	}

	runs := make([]*Run, 0, limit)
	for i, workflow := range s.runs.set {
		if i < offset {
			continue
		} else if len(runs) == limit {
			break
		}

		runs = append(runs, workflow)
	}

	return runs, nil
}

// GetWorkflowByName gets a workflow with the corresponding name field. usually matches
// the dataset name
func (s *MemStore) GetWorkflowByName(ctx context.Context, name string) (*Workflow, error) {
	s.lock.Lock()
	defer s.lock.Unlock()

	for _, workflow := range s.workflows.set {
		if workflow.Name == name {
			return workflow.Copy(), nil
		}
	}
	return nil, ErrNotFound
}

// GetWorkflowByDatasetID gets a workflow with the corresponding datasetID field
func (s *MemStore) GetWorkflowByDatasetID(ctx context.Context, datasetID string) (*Workflow, error) {
	s.lock.Lock()
	defer s.lock.Unlock()
	for _, workflow := range s.workflows.set {
		if workflow.DatasetID == datasetID {
			return workflow.Copy(), nil
		}
	}
	return nil, ErrNotFound
}

// GetWorkflow gets workflow details from the store by dataset identifier
func (s *MemStore) GetWorkflow(ctx context.Context, id string) (*Workflow, error) {
	s.lock.Lock()
	defer s.lock.Unlock()

	for _, workflow := range s.workflows.set {
		if workflow.ID == id {
			return workflow.Copy(), nil
		}
	}
	return nil, ErrNotFound
}

// GetDatasetWorkflow gets workflow details from the store by dataset identifier
func (s *MemStore) GetDatasetWorkflow(ctx context.Context, datasetID string) (*Workflow, error) {
	s.lock.Lock()
	defer s.lock.Unlock()

	for _, workflow := range s.workflows.set {
		if workflow.DatasetID == datasetID {
			return workflow.Copy(), nil
		}
	}
	return nil, ErrNotFound
}

// PutWorkflow places a workflow in the store. If the workflow name matches the name of a workflow
// that already exists, it will be overwritten with the new workflow
func (s *MemStore) PutWorkflow(ctx context.Context, workflow *Workflow) error {
	if workflow.ID == "" {
		return fmt.Errorf("ID is required")
	}
	if workflow.DatasetID == "" {
		return fmt.Errorf("DatasetID is required")
	}

	s.lock.Lock()
	s.workflows.Add(workflow)
	s.lock.Unlock()

	if workflow.CurrentRun != nil {
		if err := s.PutRun(ctx, workflow.CurrentRun); err != nil {
			return err
		}
	}
	return nil
}

// DeleteWorkflow removes a workflow from the store by name. deleting a non-existent workflow
// won't return an error
func (s *MemStore) DeleteWorkflow(ctx context.Context, id string) error {
	s.lock.Lock()
	defer s.lock.Unlock()

	if removed := s.workflows.Remove(id); removed {
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

func (s *MemStore) GetWorkflowRuns(ctx context.Context, workflowID string, offset, limit int) ([]*Run, error) {
	runs, ok := s.workflowRuns[workflowID]
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
	if run.WorkflowID == "" {
		return fmt.Errorf("WorkflowID is required")
	}

	s.lock.Lock()
	defer s.lock.Unlock()
	if workflowRuns, ok := s.workflowRuns[run.WorkflowID]; ok {
		workflowRuns.Add(run)
	} else {
		workflowRuns = NewRunSet()
		workflowRuns.Add(run)
		s.workflowRuns[run.WorkflowID] = workflowRuns
	}
	s.runs.Add(run)
	return nil
}

func (s *MemStore) DeleteAllWorkflowRuns(ctx context.Context, workflowID string) error {
	return fmt.Errorf("not finished: MemStore delete all workflow runs")
}
