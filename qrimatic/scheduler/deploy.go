package scheduler

import (
	"context"
	"fmt"
	"strings"

	"github.com/qri-io/dataset"
	"github.com/qri-io/qri/dsref"
	"github.com/qri-io/qri/lib"
)

// DeployParams represents what we need in order to deploy a workflow
type DeployParams struct {
	Apply     bool               `json:"apply"`
	Workflow  *Workflow          `json:"workflow"`
	Transform *dataset.Transform `json:"transform"`
}

// DeployResponse is what we return when we first deploy a workflow
type DeployResponse struct {
	RunID    string    `json:"runID"`
	Workflow *Workflow `json:"workflow"`
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
	res := &dataset.Dataset{}
	err := dsm.Save(saveP, res)
	if err != nil {
		if strings.Contains(err.Error(), "no changes") {
			err = nil
		} else {
			log.Errorw("deploy save dataset", "error", err)
			return nil, err
		}
	}

	ref := &dsref.Ref{
		Username: res.Peername,
		Name:     res.Name,
	}
	p.Workflow.Complete(ref, inst.Config().Profile.ID)

	// save workflow
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
