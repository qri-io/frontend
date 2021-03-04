package scheduler

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/qri-io/dataset"
	"github.com/qri-io/qri/base/dsfs"
	"github.com/qri-io/qri/dsref"
	"github.com/qri-io/qri/lib"
	"github.com/qri-io/qrimatic/workflow"
)

// DeployParams represents what we need in order to deploy a workflow
type DeployParams struct {
	Apply     bool               `json:"apply"`
	Workflow  *workflow.Workflow          `json:"workflow"`
	Transform *dataset.Transform `json:"transform"`
}

// DeployResponse is what we return when we first deploy a workflow
type DeployResponse struct {
	RunID    string    `json:"runID"`
	Workflow *workflow.Workflow `json:"workflow"`
}

// Deploy takes a workflow and transform and returns a runid and workflow
// It applys a transform to a specified dataset and schedules the workflow
func (c *Cron) Deploy(ctx context.Context, inst *lib.Instance, p *DeployParams) (*DeployResponse, error) {
	if p.Workflow == nil {
		return nil, fmt.Errorf("deploy: workflow not set")
	}
	if p.Workflow.DatasetID == "" {
		return nil, fmt.Errorf("deploy: DatasetID not set")
	}

	newWorkflow := true
	if _, err := c.Workflow(ctx, p.Workflow.ID); err == nil {
		newWorkflow = false
	}

	now := time.Now()
	if newWorkflow {
		p.Workflow.Created = &now
	}
	p.Workflow.LatestStart = &now

	dsm := lib.NewDatasetMethods(inst)
	saveP := &lib.SaveParams{
		Ref: p.Workflow.DatasetID, // currently the DatasetID is the Ref
		Dataset: &dataset.Dataset{
			Transform: p.Transform,
		},
		Apply: p.Apply,
		// Wait: false,
	}
	log.Debugw("deploying dataset", "datasetID", saveP.Ref)
	res, err := dsm.Save(ctx, saveP)
	if err != nil {
		if errors.Is(err, dsfs.ErrNoChanges) {
			err = nil
		} else {
			log.Errorw("deploy save dataset", "error", err)
			return nil, err
		}
	}

	now = NowFunc()
	p.Workflow.LatestEnd = &now
	p.Workflow.RunCount++
	p.Workflow.Status = workflow.StatusSucceeded

	if newWorkflow {
		ref := &dsref.Ref{
			Username: res.Peername,
			Name:     res.Name,
		}
		p.Workflow.Complete(ref, inst.Config().Profile.ID)
	}

	err = c.Schedule(ctx, p.Workflow)
	if err != nil {
		log.Errorw("deploy scheduling", "error", err)
	}

	return &DeployResponse{
		Workflow: p.Workflow,
	}, err
}

// Undeploy takes a workflow and removes it from the scheduler
func (c *Cron) Undeploy(ctx context.Context, workflowID string) error {
	err := c.Unschedule(ctx, workflowID)
	if err != nil {
		log.Errorw("undeploy unscheduling", "error", err)
	}
	return err
}
