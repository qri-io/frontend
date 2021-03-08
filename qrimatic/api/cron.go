package api

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	apiutil "github.com/qri-io/apiutil"
	"github.com/qri-io/qrimatic/workflow"
)

// StatusHandler is the qrimatic heath check
func (s *Server) StatusHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
}

// WorkflowsHandler returns a list of workflows
func (s *Server) WorkflowsHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		offset := apiutil.ReqParamInt(r, "offset", 0)
		limit := apiutil.ReqParamInt(r, "limit", 25)

		js, err := s.sched.ListWorkflows(r.Context(), offset, limit)
		if err != nil {
			apiutil.WriteErrResponse(w, http.StatusInternalServerError, err)
			return
		}

		apiutil.WriteResponse(w, js)
		return
	case http.MethodPost:
		wf := &workflow.Workflow{}

		if err := json.NewDecoder(r.Body).Decode(wf); err != nil {
			apiutil.WriteErrResponse(w, http.StatusBadRequest, err)
			return
		}

		if err := s.sched.Schedule(r.Context(), wf); err != nil {
			apiutil.WriteErrResponse(w, http.StatusBadRequest, err)
			return
		}
	case http.MethodPut:
		wf := &workflow.Workflow{}

		if err := json.NewDecoder(r.Body).Decode(wf); err != nil {
			apiutil.WriteErrResponse(w, http.StatusBadRequest, err)
			return
		}

		if err := s.sched.UpdateWorkflow(r.Context(), wf); err != nil {
			apiutil.WriteErrResponse(w, http.StatusBadRequest, err)
			return
		}

	case http.MethodDelete:
		name := r.FormValue("name")
		if err := s.sched.Unschedule(r.Context(), name); err != nil {
			apiutil.WriteErrResponse(w, http.StatusInternalServerError, err)
			return
		}
	}
}

func (s *Server) WorkflowHandler(w http.ResponseWriter, r *http.Request) {
	dsID := r.FormValue("dataset_id")
	wf, err := s.sched.WorkflowForDataset(r.Context(), dsID)
	if err != nil {
		if err == workflow.ErrNotFound {
			apiutil.WriteErrResponse(w, http.StatusNotFound, err)
		} else {
			apiutil.WriteErrResponse(w, http.StatusInternalServerError, err)
		}
		w.Write([]byte(err.Error()))
		return
	}

	apiutil.WriteResponse(w, wf)
}

func (s *Server) RunsHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodOptions:
		apiutil.EmptyOkHandler(w, r)
	case http.MethodGet:
		offset := apiutil.ReqParamInt(r, "offset", 0)
		limit := apiutil.ReqParamInt(r, "limit", 25)

		logs, err := s.sched.ListWorkflows(r.Context(), offset, limit)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		apiutil.WriteResponse(w, logs)
	}
}

func (s *Server) GetRunInfoHandler(w http.ResponseWriter, r *http.Request) {
	datasetID := r.FormValue("name")
	runNumber := apiutil.ReqParamInt(r, "number", 0)
	run, err := s.sched.GetRunInfo(r.Context(), datasetID, runNumber)
	if err != nil {
		apiutil.WriteErrResponse(w, http.StatusInternalServerError, err)
		return
	}

	apiutil.WriteResponse(w, run)
}

// WorkflowManualTriggerHandler triggers a workflow without a backing trigger,
// via a direct HTTP request
func (s *Server) WorkflowManualTriggerHandler(w http.ResponseWriter, r *http.Request) {
	id := r.FormValue("id")
	wf, err := s.sched.Workflow(r.Context(), id)
	if err != nil {
		if err == workflow.ErrNotFound {
			apiutil.WriteErrResponse(w, http.StatusNotFound, err)
		} else {
			apiutil.WriteErrResponse(w, http.StatusInternalServerError, err)
		}
		w.Write([]byte(err.Error()))
		return
	}
	go s.sched.RunWorkflow(context.Background(), wf, "")
}

// CollectionHandler returns a list of `WorkflowInfo`s, which include a union of
// datasets and workflows
func (s *Server) CollectionHandler(w http.ResponseWriter, r *http.Request) {
	data, err := s.sched.ListCollection(context.Background(), s.inst, time.Now(), time.Now())
	if err != nil {
		log.Errorf("error listing collection: %w", err)
		apiutil.WriteErrResponse(w, http.StatusBadRequest, err)
		return
	}
	apiutil.WriteResponse(w, data)
}

// CollectionRunningHandler returns a list of `WorkflowInfo`s whose status is
// currently "Running". They are returned in reverse chronological order by
// `LastestRun`
func (s *Server) CollectionRunningHandler(w http.ResponseWriter, r *http.Request) {
	// TODO (ramfox): until we get a better story around pagination, fetch the
	// entire list of running workflows
	wis, err := s.sched.ListRunningCollection(context.Background(), 0, -1)
	if err != nil {
		log.Errorf("error listing currently running workflows: %w", err)
		apiutil.WriteErrResponse(w, http.StatusBadRequest, err)
		return
	}
	apiutil.WriteResponse(w, wis)
}
