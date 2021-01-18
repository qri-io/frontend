package update

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/qri-io/qri/api/util"
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

		workflow, err := s.Deploy(r.Context(), p)
		if err != nil {
			util.WriteErrResponse(w, http.StatusBadRequest, err)
			return
		}

		util.WriteResponse(w, workflow)
	}
}

type DeployParams struct {
	RunFirst bool      `json:"runFirst"`
	Workflow *Workflow `json:"workflow"`
}

func (s *Service) Deploy(ctx context.Context, p *DeployParams) (*Workflow, error) {

	return nil, fmt.Errorf("not finished")
}
