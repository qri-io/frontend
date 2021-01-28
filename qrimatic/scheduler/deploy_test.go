package scheduler

import (
	"context"
	"fmt"
	"sync"
	"testing"

	"github.com/qri-io/dataset"
	"github.com/qri-io/iso8601"
	"github.com/qri-io/qfs"
	"github.com/qri-io/qri/config"
	"github.com/qri-io/qri/event"
	"github.com/qri-io/qri/lib"
	repotest "github.com/qri-io/qri/repo/test"
	"github.com/qri-io/qrimatic/scheduler"
)

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

	s, err := NewService(inst)
	if err != nil {
		t.Fatal(err)
	}
	username := cfg.Profile.Peername
	workflow, err := scheduler.NewCronWorkflow(fmt.Sprintf("%s/dataset_bar", username), "ownerID", "datasetID", "R/PT1H")
	if err != nil {
		t.Fatal(err)
	}

	tf := &dataset.Transform{
		Steps: []*dataset.TransformStep{
			{Syntax: "starlark", Category: "setup", Script: ""},
			{Syntax: "starlark", Category: "download", Script: "def download(ctx):\n\treturn"},
			{Syntax: "starlark", Category: "transform", Script: "def transform(ds, ctx):\n\tds.set_body([[1,2,3]])"},
		},
	}

	dp := &DeployParams{
		Apply:     true,
		Workflow:  workflow,
		Transform: tf,
	}
	_, err = s.Deploy(ctx, dp)
	if err != nil {
		t.Fatal(err)
	}
}

func mustRepeatingInterval(s string) iso8601.RepeatingInterval {
	ri, err := iso8601.ParseRepeatingInterval(s)
	if err != nil {
		panic(err)
	}
	return ri
}
