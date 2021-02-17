package api

import (
	"context"
	"encoding/json"
	"net/http"

	apiutil "github.com/qri-io/apiutil"
	"github.com/qri-io/qrimatic/scheduler"
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
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		apiutil.WriteResponse(w, js)
		return
	case http.MethodPost:
		workflow := &scheduler.Workflow{}

		if err := json.NewDecoder(r.Body).Decode(workflow); err != nil {
			apiutil.WriteErrResponse(w, http.StatusBadRequest, err)
			return
		}

		if err := s.sched.Schedule(r.Context(), workflow); err != nil {
			apiutil.WriteErrResponse(w, http.StatusBadRequest, err)
			return
		}
	case http.MethodPut:
		workflow := &scheduler.Workflow{}

		if err := json.NewDecoder(r.Body).Decode(workflow); err != nil {
			apiutil.WriteErrResponse(w, http.StatusBadRequest, err)
			return
		}

		if err := s.sched.UpdateWorkflow(r.Context(), workflow); err != nil {
			apiutil.WriteErrResponse(w, http.StatusBadRequest, err)
			return
		}

	case http.MethodDelete:
		name := r.FormValue("name")
		if err := s.sched.Unschedule(r.Context(), name); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}
	}
}

func (s *Server) WorkflowHandler(w http.ResponseWriter, r *http.Request) {
	dsID := r.FormValue("dataset_id")
	workflow, err := s.sched.WorkflowForDataset(r.Context(), dsID)
	if err != nil {
		if err == scheduler.ErrNotFound {
			w.WriteHeader(http.StatusNotFound)
		} else {
			w.WriteHeader(http.StatusInternalServerError)
		}
		w.Write([]byte(err.Error()))
		return
	}

	apiutil.WriteResponse(w, workflow)
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

func (s *Server) GetRunHandler(w http.ResponseWriter, r *http.Request) {
	datasetID := r.FormValue("name")
	runNumber := apiutil.ReqParamInt(r, "number", 0)
	run, err := s.sched.GetRun(r.Context(), datasetID, runNumber)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	apiutil.WriteResponse(w, run)
}

// func (s *Service) loggedWorkflowFileHandler(w http.ResponseWriter, r *http.Request) {
// 	logName := r.FormValue("log_name")
// 	f, err := c.LogFile(r.Context(), logName)
// 	if err != nil {
// 		w.WriteHeader(http.StatusInternalServerError)
// 		w.Write([]byte(err.Error()))
// 		return
// 	}

// 	io.Copy(w, f)
// 	return
// }

func (s *Server) RunHandler(w http.ResponseWriter, r *http.Request) {
	// TODO (b5): implement an HTTP run handler
	w.WriteHeader(http.StatusInternalServerError)
	w.Write([]byte("not finished"))
	// c.runWorkflow(r.Context(), nil)
}

// WorkflowListHandler returns a list of WorkflowInfos, which include workflows
// that do and do not include runs
func (s *Server) WorkflowListHandler(w http.ResponseWriter, r *http.Request) {
	data, err := s.sched.ListWorkflowInfos(context.Background(), s.inst, 25, 0)
	if err != nil {
		log.Errorf("error listing workflowInfos: %w", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}
	apiutil.WriteResponse(w, data)
}
