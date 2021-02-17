package scheduler

import (
	"testing"
)

// requires circular import
func TestDeploy(t *testing.T) {
	// tr, err := repotest.NewTempRepo("foo", "deploy_test", repotest.NewTestCrypto())
	// if err != nil {
	// 	t.Fatal(err)
	// }
	// defer tr.Delete()

	// cfg := config.DefaultConfigForTesting()
	// cfg.Filesystems = []qfs.Config{
	// 	{Type: "mem"},
	// 	{Type: "local"},
	// }
	// cfg.Repo.Type = "mem"

	// var firedEventWg sync.WaitGroup
	// firedEventWg.Add(1)
	// handler := func(_ context.Context, e event.Event) error {
	// 	if e.Type == event.ETInstanceConstructed {
	// 		firedEventWg.Done()
	// 	}
	// 	return nil
	// }

	// // need a mock remote server
	// key := lib.InstanceContextKey("RemoteClient")
	// ctxV := context.WithValue(context.Background(), key, "mock")
	// ctx, cancel := context.WithCancel(ctxV)
	// defer cancel()

	// // need to create instance with only local resolver
	// inst, err := lib.NewInstance(ctx, tr.QriPath, lib.OptConfig(cfg), lib.OptEventHandler(handler, event.ETInstanceConstructed))
	// if err != nil {
	// 	t.Fatal(err)
	// }
	// firedEventWg.Wait()

	// // NewService is fro
	// s, err := NewService(inst)
	// if err != nil {
	// 	t.Fatal(err)
	// }
	// username := cfg.Profile.Peername
	// workflow, err := NewCronWorkflow(fmt.Sprintf("%s/dataset_bar", username), "ownerID", "datasetID", "R/PT1H")
	// if err != nil {
	// 	t.Fatal(err)
	// }

	// tf := &dataset.Transform{
	// 	Steps: []*dataset.TransformStep{
	// 		{Syntax: "starlark", Category: "setup", Script: ""},
	// 		{Syntax: "starlark", Category: "download", Script: "def download(ctx):\n\treturn"},
	// 		{Syntax: "starlark", Category: "transform", Script: "def transform(ds, ctx):\n\tds.set_body([[1,2,3]])"},
	// 	},
	// }

	// dp := &DeployParams{
	// 	Apply:     true,
	// 	Workflow:  workflow,
	// 	Transform: tf,
	// }
	// _, err = s.Deploy(ctx, dp)
	// if err != nil {
	// 	t.Fatal(err)
	// }
}
