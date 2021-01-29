package scheduler

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"strings"
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

// ListWorkflows by querying an HTTP server
func (c HTTPClient) ListWorkflows(ctx context.Context, offset, limit int) ([]*Workflow, error) {
	req, err := http.NewRequest(http.MethodGet, fmt.Sprintf("http://%s/workflows?offset=%d&limit=%d", c.Addr, offset, limit), nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Accept", jsonMimeType)

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}

	return decodeJSONWorkflowsResponse(res)
}

// WorkflowForName gets a workflow by it's name (which often matches the dataset name)
func (c HTTPClient) WorkflowForName(ctx context.Context, name string) (*Workflow, error) {
	req, err := http.NewRequest(http.MethodGet, fmt.Sprintf("http://%s/workflow?name=%s", c.Addr, name), nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Accept", jsonMimeType)

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}

	if res.StatusCode == 200 {
		return decodeJSONWorkflowResponse(res)
	}

	return nil, maybeErrorResponse(res)
}

// Workflow gets a workflow by querying an HTTP server
func (c HTTPClient) Workflow(ctx context.Context, id string) (*Workflow, error) {
	req, err := http.NewRequest(http.MethodGet, fmt.Sprintf("http://%s/workflow?id=%s", c.Addr, id), nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Accept", jsonMimeType)

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}

	if res.StatusCode == 200 {
		return decodeJSONWorkflowResponse(res)
	}

	return nil, maybeErrorResponse(res)
}

// Schedule adds a workflow to the cron scheduler via an HTTP request
func (c HTTPClient) Schedule(ctx context.Context, workflow *Workflow) error {
	return c.postWorkflow(workflow)
}

// Unschedule removes a workflow from scheduling
func (c HTTPClient) Unschedule(ctx context.Context, name string) error {
	req, err := http.NewRequest(http.MethodDelete, fmt.Sprintf("http://%s/workflows?name=%s", c.Addr, name), nil)
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

func (c HTTPClient) UpdateWorkflow(ctx context.Context, workflow *Workflow) error {
	return fmt.Errorf("not implemented")
}

// Runs gives a log of executed workflows for a dataset name
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

// GetRun returns a single executed workflow by workflow.LogName
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

func (c HTTPClient) postWorkflow(workflow *Workflow) error {
	data, err := json.Marshal(workflow)
	if err != nil {
		return err
	}

	req, err := http.NewRequest(http.MethodPost, fmt.Sprintf("http://%s/workflows", c.Addr), bytes.NewReader(data))
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

func decodeJSONWorkflowsResponse(res *http.Response) ([]*Workflow, error) {
	defer res.Body.Close()
	env := struct {
		Data []*Workflow
	}{}
	if err := json.NewDecoder(res.Body).Decode(&env); err != nil {
		return nil, err
	}
	return env.Data, nil
}

func decodeJSONWorkflowResponse(res *http.Response) (*Workflow, error) {
	defer res.Body.Close()
	env := struct {
		Data *Workflow
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

// // ServeHTTP spins up an HTTP server at the specified address
// func (c *Cron) ServeHTTP(addr string) error {
// 	m := http.NewServeMux()
// 	AddCronRoutes(m, c, noopMiddlware)
// 	s := &http.Server{
// 		Addr:    addr,
// 		Handler: m,
// 	}
// 	return s.ListenAndServe()
// }

// func noopMiddlware(h http.HandlerFunc) http.HandlerFunc {
// 	return h
// }
