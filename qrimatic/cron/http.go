package cron

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"strings"

	apiutil "github.com/qri-io/apiutil"
)

const jsonMimeType = "application/json"

// HTTPClient implements the Scheduler interface over HTTP, talking to a
// Cron HTTPServer
type HTTPClient struct {
	Addr string
}

// assert HTTPClient is a Scheduler at compile time
var _ Service = (*HTTPClient)(nil)

// ErrUnreachable defines errors where the server cannot be reached
// TODO (b5): consider moving this to qfs
var ErrUnreachable = fmt.Errorf("cannot establish a connection to the server")

// Ping confirms client can dial the server, if a connection cannot be
// established at all, Ping will return ErrUnreachable
func (c HTTPClient) Ping() error {
	res, err := http.Get(fmt.Sprintf("http://%s/cron", c.Addr))
	if err != nil {
		msg := strings.ToLower(err.Error())

		// TODO (b5): a number of errors constitute a service being "unreachable",
		// we should make a more exhaustive assessment. common errors already covered:
		// "connect: Connection refused"
		// "dial tcp: lookup [url] no such host"
		if strings.Contains(msg, "refused") || strings.Contains(msg, "no such host") {
			return ErrUnreachable
		}
		return err
	}

	if res.StatusCode == http.StatusOK {
		return nil
	}
	return maybeErrorResponse(res)
}

// ListJobs  jobs by querying an HTTP server
func (c HTTPClient) ListJobs(ctx context.Context, offset, limit int) ([]*Job, error) {
	req, err := http.NewRequest(http.MethodGet, fmt.Sprintf("http://%s/jobs?offset=%d&limit=%d", c.Addr, offset, limit), nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Accept", jsonMimeType)

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}

	return decodeJSONJobsResponse(res)
}

// JobForName gets a job by it's name (which often matches the dataset name)
func (c HTTPClient) JobForName(ctx context.Context, name string) (*Job, error) {
	req, err := http.NewRequest(http.MethodGet, fmt.Sprintf("http://%s/job?name=%s", c.Addr, name), nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Accept", jsonMimeType)

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}

	if res.StatusCode == 200 {
		return decodeJSONJobResponse(res)
	}

	return nil, maybeErrorResponse(res)
}

// Job gets a job by querying an HTTP server
func (c HTTPClient) Job(ctx context.Context, id string) (*Job, error) {
	req, err := http.NewRequest(http.MethodGet, fmt.Sprintf("http://%s/job?id=%s", c.Addr, id), nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Accept", jsonMimeType)

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}

	if res.StatusCode == 200 {
		return decodeJSONJobResponse(res)
	}

	return nil, maybeErrorResponse(res)
}

// Schedule adds a job to the cron scheduler via an HTTP request
func (c HTTPClient) Schedule(ctx context.Context, job *Job) error {
	return c.postJob(job)
}

// Unschedule removes a job from scheduling
func (c HTTPClient) Unschedule(ctx context.Context, name string) error {
	req, err := http.NewRequest(http.MethodDelete, fmt.Sprintf("http://%s/jobs?name=%s", c.Addr, name), nil)
	if err != nil {
		return err
	}
	req.Header.Set("Accept", jsonMimeType)

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}

	return maybeErrorResponse(res)
}

// Runs gives a log of executed jobs for a dataset name
func (c HTTPClient) Runs(ctx context.Context, offset, limit int) ([]*Run, error) {
	req, err := http.NewRequest(http.MethodGet, fmt.Sprintf("http://%s/runs?offset=%d&limit=%d", c.Addr, offset, limit), nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Accept", jsonMimeType)

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}

	return decodeJSONRunsResponse(res)
}

// GetRun returns a single executed job by job.LogName
func (c HTTPClient) GetRun(ctx context.Context, logName string, number int) (*Run, error) {
	req, err := http.NewRequest(http.MethodGet, fmt.Sprintf("http://%s/run?name=%s", c.Addr, logName), nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Accept", jsonMimeType)

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}

	if res.StatusCode == 200 {
		return decodeJSONRunResponse(res)
	}

	return nil, maybeErrorResponse(res)
}

// LogFile returns a reader for a file at the given name
func (c HTTPClient) LogFile(ctx context.Context, logName string) (io.ReadCloser, error) {
	req, err := http.NewRequest(http.MethodGet, fmt.Sprintf("http://%s/log/output?log_name=%s", c.Addr, logName), nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Accept", jsonMimeType)

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}

	if res.StatusCode == 200 {
		return res.Body, nil
	}

	return nil, maybeErrorResponse(res)
}

func (c HTTPClient) postJob(job *Job) error {
	data, err := json.Marshal(job)
	if err != nil {
		return err
	}

	req, err := http.NewRequest(http.MethodPost, fmt.Sprintf("http://%s/jobs", c.Addr), bytes.NewReader(data))
	if err != nil {
		return err

	}
	req.Header.Set("Content-Type", jsonMimeType)
	req.Header.Set("Accept", jsonMimeType)

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}

	return maybeErrorResponse(res)
}

func maybeErrorResponse(res *http.Response) error {
	if res.StatusCode == 200 {
		return nil
	}

	errData, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return err
	}

	return fmt.Errorf(string(errData))
}

func decodeJSONJobsResponse(res *http.Response) ([]*Job, error) {
	defer res.Body.Close()
	env := struct {
		Data []*Job
	}{}
	if err := json.NewDecoder(res.Body).Decode(&env); err != nil {
		return nil, err
	}
	return env.Data, nil
}

func decodeJSONJobResponse(res *http.Response) (*Job, error) {
	defer res.Body.Close()
	env := struct {
		Data *Job
	}{}
	err := json.NewDecoder(res.Body).Decode(&env)
	return env.Data, err
}

func decodeJSONRunsResponse(res *http.Response) ([]*Run, error) {
	defer res.Body.Close()
	env := struct {
		Data []*Run
	}{}
	err := json.NewDecoder(res.Body).Decode(&env)
	return env.Data, err
}

func decodeJSONRunResponse(res *http.Response) (*Run, error) {
	defer res.Body.Close()
	run := &Run{}
	err := json.NewDecoder(res.Body).Decode(run)
	return run, err
}

// ServeHTTP spins up an HTTP server at the specified address
func (c *Cron) ServeHTTP(addr string) error {
	m := http.NewServeMux()
	AddCronRoutes(m, c, noopMiddlware)
	s := &http.Server{
		Addr:    addr,
		Handler: m,
	}
	return s.ListenAndServe()
}

func noopMiddlware(h http.HandlerFunc) http.HandlerFunc {
	return h
}

// AddCronRoutes registers cron endpoints on an *http.Mux
func AddCronRoutes(m *http.ServeMux, c *Cron, mw func(http.HandlerFunc) http.HandlerFunc) {
	m.HandleFunc("/cron", mw(c.statusHandler))
	m.HandleFunc("/jobs", mw(c.jobsHandler))
	m.HandleFunc("/job", mw(c.jobHandler))
	m.HandleFunc("/runs", mw(c.runsHandler))
	m.HandleFunc("/run", mw(c.getRunHandler))
	// m.HandleFunc("/log/output", mw(c.loggedJobFileHandler))
	// m.HandleFunc("/run", mw(c.runHandler))
}

func (c *Cron) statusHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
}

func (c *Cron) jobsHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		offset := apiutil.ReqParamInt(r, "offset", 0)
		limit := apiutil.ReqParamInt(r, "limit", 25)

		js, err := c.ListJobs(r.Context(), offset, limit)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		apiutil.WriteResponse(w, js)
		return
	case http.MethodPost:
		job := &Job{}

		if err := json.NewDecoder(r.Body).Decode(job); err != nil {
			apiutil.WriteErrResponse(w, http.StatusBadRequest, err)
			return
		}

		if err := c.Schedule(r.Context(), job); err != nil {
			apiutil.WriteErrResponse(w, http.StatusBadRequest, err)
			return
		}

	case http.MethodDelete:
		name := r.FormValue("name")
		if err := c.Unschedule(r.Context(), name); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}
	}
}

func (c *Cron) jobHandler(w http.ResponseWriter, r *http.Request) {
	name := r.FormValue("name")
	job, err := c.JobForName(r.Context(), name)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	apiutil.WriteResponse(w, job)
}

func (c *Cron) runsHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodOptions:
		apiutil.EmptyOkHandler(w, r)
	case http.MethodGet:
		offset := apiutil.ReqParamInt(r, "offset", 0)
		limit := apiutil.ReqParamInt(r, "limit", 25)

		logs, err := c.ListJobs(r.Context(), offset, limit)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		apiutil.WriteResponse(w, logs)
	}
}

func (c *Cron) getRunHandler(w http.ResponseWriter, r *http.Request) {
	datasetID := r.FormValue("name")
	runNumber := apiutil.ReqParamInt(r, "number", 0)
	run, err := c.GetRun(r.Context(), datasetID, runNumber)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	apiutil.WriteResponse(w, run)
}

// func (c *Cron) loggedJobFileHandler(w http.ResponseWriter, r *http.Request) {
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

func (c *Cron) runHandler(w http.ResponseWriter, r *http.Request) {
	// TODO (b5): implement an HTTP run handler
	w.WriteHeader(http.StatusInternalServerError)
	w.Write([]byte("not finished"))
	// c.runJob(r.Context(), nil)
}
