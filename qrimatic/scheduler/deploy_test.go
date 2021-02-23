package scheduler

import (
	"context"
	"fmt"
	"sync"
	"testing"

	"github.com/qri-io/dataset"
	"github.com/qri-io/ioes"
	"github.com/qri-io/qfs"
	"github.com/qri-io/qri/config"
	"github.com/qri-io/qri/event"
	"github.com/qri-io/qri/lib"
	repotest "github.com/qri-io/qri/repo/test"
)

// requires circular import
func TestDeploy(t *testing.T) {
	tr, err := repotest.NewTempRepo("foo", "deploy_test", repotest.NewTestCrypto())
	if err != nil {
		t.Fatal(err)
	}
	defer tr.Delete()

	cfg := config.DefaultConfigForTesting()
	cfg.Filesystems = []qfs.Config{
		{Type: "mem"},
		{Type: "local"},
	}
	cfg.Repo.Type = "mem"

	var firedEventWg sync.WaitGroup
	firedEventWg.Add(1)
	handler := func(_ context.Context, e event.Event) error {
		if e.Type == event.ETInstanceConstructed {
			firedEventWg.Done()
		}
		return nil
	}

	// need a mock remote server
	key := lib.InstanceContextKey("RemoteClient")
	ctxV := context.WithValue(context.Background(), key, "mock")
	ctx, cancel := context.WithCancel(ctxV)
	defer cancel()

	// need to create instance with only local resolver
	inst, err := lib.NewInstance(ctx, tr.QriPath, lib.OptConfig(cfg), lib.OptEventHandler(handler, event.ETInstanceConstructed))
	if err != nil {
		t.Fatal(err)
	}
	firedEventWg.Wait()

	store := NewMemStore(inst.Bus())

	factory := func(ctx context.Context) RunWorkflowFunc {
		return func(ctx context.Context, stream ioes.IOStreams, workflow *Workflow) error {
			return nil
		}
	}

	// NewService is fro
	c := NewCron(store, factory, inst.Bus())

	username := cfg.Profile.Peername

	workflow, err := NewCronWorkflow("workflowName", "ownerID", fmt.Sprintf("%s/dataset_bar", username), "R/PT1H")
	if err != nil {
		t.Fatal(err)
	}

	tf := &dataset.Transform{
		Steps: []*dataset.TransformStep{
			{Syntax: "starlark", Category: "setup", Script: ""},
			{Syntax: "starlark", Category: "download", Script: "def download(ctx):\n\treturn"},
			{Syntax: "starlark", Category: "transform", Script: "def transform(ds, ctx):\n\tds.set_body({'first': [1,2,3]})"},
		},
	}

	dp := &DeployParams{
		Apply:     true,
		Workflow:  workflow,
		Transform: tf,
	}
	_, err = c.Deploy(ctx, inst, dp)
	if err != nil {
		t.Fatal(err)
	}
}
