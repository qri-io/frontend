package scheduler

import (
	"context"
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
	"testing"

	"github.com/qri-io/dataset"
	"github.com/qri-io/ioes"
	"github.com/qri-io/qri/lib"
	"github.com/qri-io/qri/repo/gen"
	repotest "github.com/qri-io/qri/repo/test"
	"github.com/qri-io/qri/transform"
)

func TestScheduleWorkflowIntegration(t *testing.T) {

	username := "integration_test"
	tr := NewSchedulerTestRunner(t, username)
	defer tr.Cleanup()
	workflowName := "workflowName"
	ownerID := "ownerID"
	// TODO (ramfox): until we replace `datasetID` with `InitID`, qrimatic
	// expects the datasetID to be the dataset alias.
	// TODO (ramfox): until we get multi tenancy the only "username" that
	// qri will expect is the username of the repo
	datasetID := fmt.Sprintf("%s/dataset_name", username)
	w, err := NewCronWorkflow(workflowName, ownerID, datasetID, "R/PT1H")
	if err != nil {
		t.Fatalf("creating workflow: %s", err)
	}
	dp := &DeployParams{
		Apply:    true,
		Workflow: w,
		Transform: &dataset.Transform{
			Steps: []*dataset.TransformStep{
				{
					Name:   "transform",
					Syntax: "starlark",
					Script: "def transform(ds,ctx):\n  ds.set_body([[1,2,3],[4,5,6]])",
				},
			},
		},
	}
	ctx := context.Background()
	dr, err := tr.cron.Deploy(ctx, tr.inst, dp)
	if err != nil {
		t.Fatalf("deploying workflow: %s", err)
	}
	t.Log(dr)
	_, err = tr.cron.Workflow(ctx, w.ID)
	if err != nil {
		t.Fatalf("getting workflow from cron: %s", err)
	}
	// deploy workflow
	// check that the workflow is in the store
	// manually trigger workflow
	// check that the workflow updates & dataset is different in expected way
	// adjust trigger time
	// check that trigger time has updated in store
	// wait until trigger is supposed to run
	// check that workflow events are firing in correct time
	// check that after workflow has run it has updated as expected
	// update transform & deploy
}

// copy pasted from `api` (can't be imported b/c of circular import issues):
// newInstanceRunnerFactory returns a factory function that produces a workflow
// runner from a qri instance
func newInstanceRunnerFactory(inst *lib.Instance) func(ctx context.Context) RunWorkflowFunc {
	return func(ctx context.Context) RunWorkflowFunc {
		dsm := lib.NewDatasetMethods(inst)

		return func(ctx context.Context, streams ioes.IOStreams, workflow *Workflow) error {
			runID := transform.NewRunID()

			// runState = run.NewState(runID)
			// m.inst.bus.SubscribeID(func(ctx context.Context, e event.Event) error {
			// 	runState.AddTransformEvent(e)
			// 	return nil
			// }, runID)

			p := &lib.SaveParams{
				Ref: workflow.DatasetID,
				Dataset: &dataset.Dataset{
					Commit: &dataset.Commit{
						RunID: runID,
					},
				},
				Apply: true,
			}
			_, err := dsm.Save(ctx, p)
			return err
		}
	}
}

type SchedulerTestRunner struct {
	cancel     context.CancelFunc
	TestCrypto gen.CryptoGenerator
	repo       *repotest.TempRepo
	inst       *lib.Instance
	store      *Store
	cron       *Cron
	storePath  string
	// when we get identity that is separate from the qri repo identity
	// we need to keep track of the different users creating workflows in the
	// test runner
	// maybe with some `User` struct that keeps a username and a generated
	// private key, that gets connected correctly to the qrimatic and qri instances
	// beth &User
}

func (tr *SchedulerTestRunner) Cleanup() {
	tr.cancel()
	if tr.storePath != "" {
		os.RemoveAll(tr.storePath)
	}
	if tr.repo != nil {
		tr.repo.Delete()
	}
}

func NewSchedulerTestRunner(t *testing.T, prefix string) *SchedulerTestRunner {
	ctx, cancel := context.WithCancel(context.Background())
	tr := &SchedulerTestRunner{
		cancel:     cancel,
		TestCrypto: repotest.NewTestCrypto(),
	}
	repo, err := repotest.NewTempRepo(prefix, fmt.Sprintf("%s_scheduler_test_runner_repo", prefix), tr.TestCrypto)
	if err != nil {
		t.Fatal(err)
	}
	tr.repo = &repo

	tr.inst, err = lib.NewInstance(ctx, tr.repo.QriPath, lib.OptIOStreams(ioes.NewDiscardIOStreams()))
	if err != nil {
		t.Fatal(err)
	}

	tr.storePath, err = ioutil.TempDir(os.TempDir(), fmt.Sprintf("%s_scheduler_test_runner_store", prefix))
	if err != nil {
		t.Fatal(err)
	}

	store, err := NewFileStore(filepath.Join(tr.storePath, "workflows.json"), tr.inst.Bus())
	if err != nil {
		t.Fatal(err)
	}
	tr.store = &store

	f := newInstanceRunnerFactory(tr.inst)
	tr.cron = NewCron(*tr.store, f, tr.inst.Bus())
	return tr
}
