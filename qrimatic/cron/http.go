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

	flatbuffers "github.com/google/flatbuffers/go"
	apiutil "github.com/qri-io/apiutil"
	cronfb "github.com/qri-io/qrimatic/cron/cron_fbs"
)

const (
	jsonMimeType = "application/json"
	// use binary mime types in an "Accept" header to get flatbuffers back as an
	// http response
	binaryMimeType = "application/octet-stream"
)

// HTTPClient implements the Scheduler interface over HTTP, talking to a
// Cron HTTPServer
type HTTPClient struct {
	Addr string
}

// assert HTTPClient is a Scheduler at compile time
var _ Scheduler = (*HTTPClient)(nil)

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
	req.Header.Set("Accept", binaryMimeType)

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}

	return decodeListJobsResponse(res)
}

// Job gets a job by querying an HTTP server
func (c HTTPClient) Job(ctx context.Context, name string) (*Job, error) {
	req, err := http.NewRequest(http.MethodGet, fmt.Sprintf("http://%s/job?name=%s", c.Addr, name), nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Accept", binaryMimeType)

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}

	if res.StatusCode == 200 {
		return decodeJobResponse(res)
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
	req.Header.Set("Accept", binaryMimeType)

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}

	return maybeErrorResponse(res)
}

// ListLogs gives a log of executed jobs
func (c HTTPClient) ListLogs(ctx context.Context, offset, limit int) ([]*Job, error) {
	req, err := http.NewRequest(http.MethodGet, fmt.Sprintf("http://%s/logs?offset=%d&limit=%d", c.Addr, offset, limit), nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Accept", binaryMimeType)

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}

	return decodeListJobsResponse(res)
}

// Log returns a single executed job by job.LogName
func (c HTTPClient) Log(ctx context.Context, logName string) (*Job, error) {
	req, err := http.NewRequest(http.MethodGet, fmt.Sprintf("http://%s/log?log_name=%s", c.Addr, logName), nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Accept", binaryMimeType)

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}

	if res.StatusCode == 200 {
		return decodeJobResponse(res)
	}

	return nil, maybeErrorResponse(res)
}

// LogFile returns a reader for a file at the given name
func (c HTTPClient) LogFile(ctx context.Context, logName string) (io.ReadCloser, error) {
	req, err := http.NewRequest(http.MethodGet, fmt.Sprintf("http://%s/log/output?log_name=%s", c.Addr, logName), nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Accept", binaryMimeType)

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
	builder := flatbuffers.NewBuilder(0)
	off := job.MarshalFlatbuffer(builder)
	builder.Finish(off)
	body := bytes.NewReader(builder.FinishedBytes())

	req, err := http.NewRequest(http.MethodPost, fmt.Sprintf("http://%s/jobs", c.Addr), body)
	if err != nil {
		return err

	}
	req.Header.Set("Content-Type", binaryMimeType)
	req.Header.Set("Accept", binaryMimeType)

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

func decodeListJobsResponse(res *http.Response) ([]*Job, error) {
	defer res.Body.Close()
	data, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}

	js := cronfb.GetRootAsJobs(data, 0)
	dec := &cronfb.Job{}
	jobs := make([]*Job, js.ListLength())

	for i := 0; i < js.ListLength(); i++ {
		if js.List(dec, i) {
			decJob := &Job{}
			if err := decJob.UnmarshalFlatbuffer(dec); err != nil {
				return nil, err
			}
			jobs[i] = decJob
		}
	}

	return jobs, nil
}

func decodeJobResponse(res *http.Response) (*Job, error) {
	defer res.Body.Close()
	data, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}

	js := cronfb.GetRootAsJob(data, 0)
	dec := &Job{}
	err = dec.UnmarshalFlatbuffer(js)
	return dec, err
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
	m.HandleFunc("/logs", mw(c.logsHandler))
	m.HandleFunc("/log", mw(c.loggedJobHandler))
	m.HandleFunc("/log/output", mw(c.loggedJobFileHandler))
	m.HandleFunc("/run", mw(c.runHandler))
}

func (c *Cron) statusHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
}

func (c *Cron) jobsHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodOptions:
		apiutil.EmptyOkHandler(w, r)
	case http.MethodGet:
		offset := apiutil.ReqParamInt(r, "offset", 0)
		limit := apiutil.ReqParamInt(r, "limit", 25)

		js, err := c.ListJobs(r.Context(), offset, limit)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		switch r.Header.Get("Accept") {
		case binaryMimeType:
			w.Write(jobs(js).FlatbufferBytes())
		default:
			apiutil.WriteResponse(w, jobs(js))
		}
		return
	case http.MethodPost:
		job := &Job{}

		switch r.Header.Get("Content-Type") {
		case jsonMimeType:
			if err := json.NewDecoder(r.Body).Decode(job); err != nil {
				apiutil.WriteErrResponse(w, http.StatusBadRequest, err)
				return
			}
		case binaryMimeType:
			data, err := ioutil.ReadAll(r.Body)
			if err != nil {
				w.WriteHeader(http.StatusBadRequest)
				return
			}

			j := cronfb.GetRootAsJob(data, 0)
			if err := job.UnmarshalFlatbuffer(j); err != nil {
				w.WriteHeader(http.StatusBadRequest)
				w.Write([]byte(err.Error()))
				return
			}
		}

		if err := c.schedule.PutJob(r.Context(), job); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
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
	job, err := c.Job(r.Context(), name)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	switch r.Header.Get("Accept") {
	case binaryMimeType:
		w.Write(job.FlatbufferBytes())
	default:
		apiutil.WriteResponse(w, job)
	}
}

func (c *Cron) logsHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodOptions:
		apiutil.EmptyOkHandler(w, r)
	case http.MethodGet:
		offset := apiutil.ReqParamInt(r, "offset", 0)
		limit := apiutil.ReqParamInt(r, "limit", 25)

		logs, err := c.ListLogs(r.Context(), offset, limit)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		switch r.Header.Get("Accept") {
		case binaryMimeType:
			w.Write(jobs(logs).FlatbufferBytes())
		default:
			apiutil.WriteResponse(w, jobs(logs))
		}
	}
}

func (c *Cron) loggedJobHandler(w http.ResponseWriter, r *http.Request) {
	logName := r.FormValue("log_name")
	job, err := c.Log(r.Context(), logName)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	w.Write(job.FlatbufferBytes())
}

func (c *Cron) loggedJobFileHandler(w http.ResponseWriter, r *http.Request) {
	logName := r.FormValue("log_name")
	f, err := c.LogFile(r.Context(), logName)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	io.Copy(w, f)
	return
}

func (c *Cron) runHandler(w http.ResponseWriter, r *http.Request) {
	// TODO (b5): implement an HTTP run handler
	w.WriteHeader(http.StatusInternalServerError)
	w.Write([]byte("not finished"))
	// c.runJob(r.Context(), nil)
}
