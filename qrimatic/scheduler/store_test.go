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
		jobs, err := store.ListWorkflows(ctx, 0, -1)
		if err != nil {
			t.Fatal(err)
		}
		if len(jobs) != 0 {
			t.Errorf("expected new store to contain no jobs")
		}

		jobOne := &Workflow{
			Name:        "job_one",
			DatasetID:   "dsID1",
			Periodicity: mustRepeatingInterval("R/PT1H"),
			ID:          "jobID",
		}
		if err = store.PutWorkflow(ctx, jobOne); err != nil {
			t.Errorf("putting job one: %s", err)
		}

		if jobs, err = store.ListWorkflows(ctx, 0, -1); err != nil {
			t.Fatal(err)
		}
		if len(jobs) != 1 {
			t.Fatal("expected default get to return inserted job")
		}
		if diff := compareWorkflow(jobOne, jobs[0]); diff != "" {
			t.Errorf("stored job mismatch (-want +got):\n%s", diff)
		}

		// d2 := time.Date(2001, 1, 1, 1, 1, 1, 1, time.UTC)
		jobTwo := &Workflow{
			ID:          "job2",
			Name:        "job two",
			DatasetID:   "dsID2",
			Periodicity: mustRepeatingInterval("R/P3M"),
			// RunStart:    &d2,
		}
		if err = store.PutWorkflow(ctx, jobTwo); err != nil {
			t.Errorf("putting job one: %s", err)
		}

		if jobs, err = store.ListWorkflows(ctx, 0, -1); err != nil {
			t.Fatal(err)
		}
		expect := []*Workflow{jobTwo, jobOne}
		if diff := cmp.Diff(expect, jobs, cmpopts.IgnoreUnexported(iso8601.Duration{})); diff != "" {
			t.Errorf("job slice mismatch (-want +got):\n%s", diff)
		}

		jobThree := &Workflow{
			Name:        "job_three",
			Periodicity: mustRepeatingInterval("R/PT1H"),
			Options: &DatasetOptions{
				Title: "hallo",
			},
		}
		if err = store.PutWorkflow(ctx, jobThree); err != nil {
			t.Errorf("putting job three: %s", err)
		}
		gotWorkflowThree, err := store.GetWorkflow(ctx, jobThree.ID)
		if err != nil {
			t.Errorf("getting jobThree: %s", err)
		}
		if diff := compareWorkflow(jobThree, gotWorkflowThree); diff != "" {
			t.Errorf("jobThree mismatch (-want +got):\n%s", diff)
		}

		// d3 := time.Date(2002, 1, 1, 1, 1, 1, 1, time.UTC)
		updatedWorkflowOne := &Workflow{
			Name:        jobOne.Name,
			Periodicity: jobOne.Periodicity,
			// RunStart:    &d3,
		}
		if err = store.PutWorkflow(ctx, updatedWorkflowOne); err != nil {
			t.Errorf("putting job one: %s", err)
		}

		if jobs, err = store.ListWorkflows(ctx, 1, 1); err != nil {
			t.Fatal(err)
		}
		if len(jobs) != 1 {
			t.Fatal("expected limit 1 length to equal 1")
		}
		if diff := compareWorkflow(jobTwo, jobs[0]); diff != "" {
			t.Errorf("jobTwo mismatch (-want +got):\n%s", diff)
		}

		job, err := store.GetWorkflow(ctx, updatedWorkflowOne.ID)
		if err != nil {
			t.Fatal(err)
		}
		if diff := compareWorkflow(updatedWorkflowOne, job); diff != "" {
			t.Errorf("updated jobOne mismatch (-want +got):\n%s", diff)
		}

		if err = store.DeleteWorkflow(ctx, updatedWorkflowOne.Name); err != nil {
			t.Error(err)
		}
		if err = store.DeleteWorkflow(ctx, jobTwo.Name); err != nil {
			t.Error(err)
		}
		if err = store.DeleteWorkflow(ctx, jobThree.Name); err != nil {
			t.Error(err)
		}

		if jobs, err = store.ListWorkflows(ctx, 0, -1); err != nil {
			t.Fatal(err)
		}
		if len(jobs) != 0 {
			t.Error("expected deleted jobs to equal zero")
		}

		if dest, ok := store.(qfs.Destroyer); ok {
			if err := dest.Destroy(); err != nil {
				t.Log(err)
			}
		}
	})

	t.Run("TestWorkflowStoreValidPut", func(t *testing.T) {
		r1h := mustRepeatingInterval("R/PT1H")
		bad := []struct {
			description string
			job         *Workflow
		}{
			{"empty", &Workflow{}},
			{"no name", &Workflow{Periodicity: r1h}},
			{"no periodicity", &Workflow{Name: "some_name"}},
			{"no type", &Workflow{Name: "some_name", Periodicity: r1h}},

			{"invalid periodicity", &Workflow{Name: "some_name"}},
			{"invalid WorkflowType", &Workflow{Name: "some_name", Periodicity: r1h}},
		}

		store := newStore()
		for i, c := range bad {
			if err := store.PutWorkflow(ctx, c.job); err == nil {
				t.Errorf("bad case %d %s: expected error, got nil", i, c.description)
			}
		}
	})

	t.Run("TestWorkflowStoreConcurrentUse", func(t *testing.T) {
		t.Skip("TODO (b5)")
	})
}
