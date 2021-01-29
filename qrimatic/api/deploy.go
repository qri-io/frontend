package api

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/qri-io/qri/api/util"
	"github.com/qri-io/qrimatic/scheduler"
)

// DeployHandler parses the deploy request and executes it
func (s *Server) DeployHandler(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()

	p := &scheduler.DeployParams{}
	if err := json.NewDecoder(r.Body).Decode(p); err != nil {
		util.WriteErrResponse(w, http.StatusBadRequest, err)
		return
	}
	log.Warnw("deploying", "params", p)

	workflow, err := s.sched.Deploy(r.Context(), s.inst, p)
	if err != nil {
		log.Warnf("error deploying: %s", err)
		util.WriteErrResponse(w, http.StatusBadRequest, err)
		return
	}

	util.WriteResponse(w, workflow)
}

// UndeployHandler parses the request and unschedules the provided workflow
func (s *Server) UndeployHandler(path string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		defer r.Body.Close()

		if r.Method != http.MethodDelete {
			w.WriteHeader(http.StatusNotFound)
			return
		}

		wid := idFromReq(path, r)
		if wid == "" {
			util.WriteErrResponse(w, http.StatusBadRequest, fmt.Errorf("error undeploying: ID is empty"))
			return
		}
		log.Warnw("undeploying", "ID", wid)

		err := s.sched.Undeploy(r.Context(), wid)
		if err != nil {
			log.Warnf("error undeploying: %s", err)
			util.WriteErrResponse(w, http.StatusBadRequest, err)
			return
		}

		w.WriteHeader(http.StatusOK)
	}
}
