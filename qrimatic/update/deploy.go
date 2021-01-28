package update

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"

	"github.com/qri-io/dataset"
	"github.com/qri-io/qri/api/util"
	"github.com/qri-io/qri/dsref"
	"github.com/qri-io/qri/lib"
	"github.com/qri-io/qrimatic/scheduler"
)

// NewDeployHandler creates a deploy http handler function
func (s *Service) NewDeployHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		defer r.Body.Close()

		p := &DeployParams{}
		if err := json.NewDecoder(r.Body).Decode(p); err != nil {
			util.WriteErrResponse(w, http.StatusBadRequest, err)
			return
		}
		log.Warnw("deploying", "params", p)

		workflow, err := s.Deploy(r.Context(), p)
		if err != nil {
			log.Warnf("error deploying: %s", err)
			util.WriteErrResponse(w, http.StatusBadRequest, err)
			return
		}

		util.WriteResponse(w, workflow)
	}
}

// DeployParams represents what we need in order to deploy a workflow
type DeployParams struct {
	Apply     bool                `json:"apply"`
	Workflow  *scheduler.Workflow `json:"workflow"`
	Transform *dataset.Transform  `json:"transform"`
}

// DeployResponse is what we return when we first deploy a workflow
type DeployResponse struct {
	RunID    string              `json:"runID"`
	Workflow *scheduler.Workflow `json:"workflow"`
}

// Deploy takes a workflow and transform and returns a runid and workflow
// It applys a transform to a specified dataset and schedules the workflow
func (s *Service) Deploy(ctx context.Context, p *DeployParams) (*DeployResponse, error) {
	dsm := lib.NewDatasetMethods(s.inst)
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
	p.Workflow.Complete(ref, s.inst.Config().Profile.ID)

	// save workflow
	err = s.sched.Schedule(ctx, p.Workflow)
	if err != nil {
		log.Errorw("deploy scheduling", "error", err)
	}

	return &DeployResponse{
		Workflow: p.Workflow,
	}, err
}
