package update

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/qri-io/dataset"
	"github.com/qri-io/qri/api/util"
	"github.com/qri-io/qri/lib"
	"github.com/qri-io/qrimatic/scheduler"
)

// NewDeployHandler creates a deploy http handler function
func (s *Service) NewDeployHandler(path string) http.HandlerFunc {
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

type DeployParams struct {
	Apply     bool                `json:"apply"`
	Workflow  *scheduler.Workflow `json:"workflow"`
	Transform *dataset.Transform  `json:"transform"`
}

type DeployResponse struct {
	RunID    string              `json:"runID"`
	Workflow *scheduler.Workflow `json:"workflow"`
}

func (s *Service) Deploy(ctx context.Context, p *DeployParams) (*DeployResponse, error) {
	// save dataset
	dsm := lib.NewDatasetMethods(s.inst)
	saveP := &lib.SaveParams{
		Ref: p.Workflow.DatasetID,
		Dataset: &dataset.Dataset{
			Transform: p.Transform,
		},
		Apply: p.Apply,
		// Wait: false,
	}

	res := &dataset.Dataset{}
	if err := dsm.Save(saveP, res); err != nil {
		return nil, err
	}

	// save workflow
	err := s.scheduler.Schedule(ctx, p.Workflow)
	return &DeployResponse{
		Workflow: p.Workflow,
	}, err
}
