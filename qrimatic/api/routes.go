package api

import (
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
)

// AddRoutes registers cron routes with an *http.Mux.
func (s *Server) AddRoutes(m *mux.Router, prefix string, mw func(http.HandlerFunc) http.HandlerFunc) {
	route := func(route string) string {
		return fmt.Sprintf("%s%s", prefix, route)
	}

	s.AddCronRoutes(m, mw)

	// workflow routes
	m.HandleFunc(route("/deploy"), mw(s.DeployHandler))
	m.HandleFunc(route("/undeploy/"), mw(s.UndeployHandler(route("/undeploy/"))))
}

// AddCronRoutes registers cron endpoints on an *http.Mux
func (s *Server) AddCronRoutes(m *mux.Router, mw func(http.HandlerFunc) http.HandlerFunc) {
	m.HandleFunc("/cron", mw(s.StatusHandler))
	m.HandleFunc("/workflows", mw(s.WorkflowsHandler))
	m.HandleFunc("/collection", mw(s.CollectionHandler))
	m.HandleFunc("/workflow", mw(s.WorkflowHandler))
	m.HandleFunc("/runs", mw(s.RunsHandler))
	m.HandleFunc("/run", mw(s.GetRunHandler))
	// m.HandleFunc("/log/output", mw(c.loggedWorkflowFileHandler))
	// m.HandleFunc("/run", mw(c.runHandler))
}
