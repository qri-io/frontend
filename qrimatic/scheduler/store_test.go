package scheduler

import (
	"context"
	"testing"

	"github.com/google/go-cmp/cmp"
	"github.com/google/go-cmp/cmp/cmpopts"
	"github.com/qri-io/iso8601"
	"github.com/qri-io/qfs"
)

func TestMemStore(t *testing.T) {
	newStore := func() Store {
		return NewMemStore()
	}
	RunWorkflowStoreTests(t, newStore)
}

func RunWorkflowStoreTests(t *testing.T, newStore func() Store) {
	ctx := context.Background()

	t.Run("WorkflowStoreTest", func(t *testing.T) {
		store := newStore()
		workflows, err := store.ListWorkflows(ctx, 0, -1)
		if err != nil {
			t.Fatal(err)
		}
		if len(workflows) != 0 {
			t.Errorf("expected new store to contain no workflows")
		}

		workflowOne := &Workflow{
			Name:      "workflow_one",
			DatasetID: "dsID1",
			Type:      JTDataset,
			ID:        "workflowID",
		}
		if err = store.PutWorkflow(ctx, workflowOne); err != nil {
			t.Errorf("putting workflow one: %s", err)
		}

		if workflows, err = store.ListWorkflows(ctx, 0, -1); err != nil {
			t.Fatal(err)
		}
		if len(workflows) != 1 {
			t.Fatal("expected default get to return inserted workflow")
		}
		if diff := compareWorkflow(workflowOne, workflows[0]); diff != "" {
			t.Errorf("stored workflow mismatch (-want +got):\n%s", diff)
		}

		// d2 := time.Date(2001, 1, 1, 1, 1, 1, 1, time.UTC)
		workflowTwo := &Workflow{
			ID:        "workflow2",
			Name:      "workflow two",
			DatasetID: "dsID2",
			Type:      JTShellScript,
			// RunStart:    &d2,
		}
		if err = store.PutWorkflow(ctx, workflowTwo); err != nil {
			t.Errorf("putting workflow one: %s", err)
		}

		if workflows, err = store.ListWorkflows(ctx, 0, -1); err != nil {
			t.Fatal(err)
		}
		expect := []*Workflow{workflowTwo, workflowOne}
		if diff := cmp.Diff(expect, workflows, cmpopts.IgnoreUnexported(iso8601.Duration{})); diff != "" {
			t.Errorf("workflow slice mismatch (-want +got):\n%s", diff)
		}

		workflowThree := &Workflow{
			Name: "workflow_three",
			Type: JTDataset,
			Options: &DatasetOptions{
				Title: "hallo",
			},
		}
		if err = store.PutWorkflow(ctx, workflowThree); err != nil {
			t.Errorf("putting workflow three: %s", err)
		}
		gotWorkflowThree, err := store.GetWorkflow(ctx, workflowThree.ID)
		if err != nil {
			t.Errorf("getting workflowThree: %s", err)
		}
		if diff := compareWorkflow(workflowThree, gotWorkflowThree); diff != "" {
			t.Errorf("workflowThree mismatch (-want +got):\n%s", diff)
		}

		// d3 := time.Date(2002, 1, 1, 1, 1, 1, 1, time.UTC)
		updatedWorkflowOne := &Workflow{
			Name: workflowOne.Name,
			Type: workflowOne.Type,
			// RunStart:    &d3,
		}
		if err = store.PutWorkflow(ctx, updatedWorkflowOne); err != nil {
			t.Errorf("putting workflow one: %s", err)
		}

		if workflows, err = store.ListWorkflows(ctx, 1, 1); err != nil {
			t.Fatal(err)
		}
		if len(workflows) != 1 {
			t.Fatal("expected limit 1 length to equal 1")
		}
		if diff := compareWorkflow(workflowTwo, workflows[0]); diff != "" {
			t.Errorf("workflowTwo mismatch (-want +got):\n%s", diff)
		}

		workflow, err := store.GetWorkflow(ctx, updatedWorkflowOne.ID)
		if err != nil {
			t.Fatal(err)
		}
		if diff := compareWorkflow(updatedWorkflowOne, workflow); diff != "" {
			t.Errorf("updated workflowOne mismatch (-want +got):\n%s", diff)
		}

		if err = store.DeleteWorkflow(ctx, updatedWorkflowOne.Name); err != nil {
			t.Error(err)
		}
		if err = store.DeleteWorkflow(ctx, workflowTwo.Name); err != nil {
			t.Error(err)
		}
		if err = store.DeleteWorkflow(ctx, workflowThree.Name); err != nil {
			t.Error(err)
		}

		if workflows, err = store.ListWorkflows(ctx, 0, -1); err != nil {
			t.Fatal(err)
		}
		if len(workflows) != 0 {
			t.Error("expected deleted workflows to equal zero")
		}

		if dest, ok := store.(qfs.Destroyer); ok {
			if err := dest.Destroy(); err != nil {
				t.Log(err)
			}
		}
	})

	t.Run("TestWorkflowStoreValidPut", func(t *testing.T) {
		bad := []struct {
			description string
			workflow    *Workflow
		}{
			{"empty", &Workflow{}},
			{"no name", &Workflow{Type: JTDataset}},
			{"no periodicity", &Workflow{Name: "some_name", Type: JTDataset}},
			{"no type", &Workflow{Name: "some_name"}},

			{"invalid periodicity", &Workflow{Name: "some_name", Type: JTDataset}},
			{"invalid WorkflowType", &Workflow{Name: "some_name", Type: WorkflowType("huh")}},
		}

		store := newStore()
		for i, c := range bad {
			if err := store.PutWorkflow(ctx, c.workflow); err == nil {
				t.Errorf("bad case %d %s: expected error, got nil", i, c.description)
			}
		}
	})

	t.Run("TestWorkflowStoreConcurrentUse", func(t *testing.T) {
		t.Skip("TODO (b5)")
	})
}
