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
	RunJobStoreTests(t, newStore)
}

func RunJobStoreTests(t *testing.T, newStore func() Store) {
	ctx := context.Background()

	t.Run("JobStoreTest", func(t *testing.T) {
		store := newStore()
		jobs, err := store.ListJobs(ctx, 0, -1)
		if err != nil {
			t.Fatal(err)
		}
		if len(jobs) != 0 {
			t.Errorf("expected new store to contain no jobs")
		}

		jobOne := &Job{
			Name:        "job_one",
			DatasetID:   "dsID1",
			Periodicity: mustRepeatingInterval("R/PT1H"),
			Type:        JTDataset,
			ID:          "jobID",
		}
		if err = store.PutJob(ctx, jobOne); err != nil {
			t.Errorf("putting job one: %s", err)
		}

		if jobs, err = store.ListJobs(ctx, 0, -1); err != nil {
			t.Fatal(err)
		}
		if len(jobs) != 1 {
			t.Fatal("expected default get to return inserted job")
		}
		if diff := compareJob(jobOne, jobs[0]); diff != "" {
			t.Errorf("stored job mismatch (-want +got):\n%s", diff)
		}

		// d2 := time.Date(2001, 1, 1, 1, 1, 1, 1, time.UTC)
		jobTwo := &Job{
			ID:          "job2",
			Name:        "job two",
			DatasetID:   "dsID2",
			Periodicity: mustRepeatingInterval("R/P3M"),
			Type:        JTShellScript,
			// RunStart:    &d2,
		}
		if err = store.PutJob(ctx, jobTwo); err != nil {
			t.Errorf("putting job one: %s", err)
		}

		if jobs, err = store.ListJobs(ctx, 0, -1); err != nil {
			t.Fatal(err)
		}
		expect := []*Job{jobTwo, jobOne}
		if diff := cmp.Diff(expect, jobs, cmpopts.IgnoreUnexported(iso8601.Duration{})); diff != "" {
			t.Errorf("job slice mismatch (-want +got):\n%s", diff)
		}

		jobThree := &Job{
			Name:        "job_three",
			Periodicity: mustRepeatingInterval("R/PT1H"),
			Type:        JTDataset,
			Options: &DatasetOptions{
				Title: "hallo",
			},
		}
		if err = store.PutJob(ctx, jobThree); err != nil {
			t.Errorf("putting job three: %s", err)
		}
		gotJobThree, err := store.GetJob(ctx, jobThree.ID)
		if err != nil {
			t.Errorf("getting jobThree: %s", err)
		}
		if diff := compareJob(jobThree, gotJobThree); diff != "" {
			t.Errorf("jobThree mismatch (-want +got):\n%s", diff)
		}

		// d3 := time.Date(2002, 1, 1, 1, 1, 1, 1, time.UTC)
		updatedJobOne := &Job{
			Name:        jobOne.Name,
			Periodicity: jobOne.Periodicity,
			Type:        jobOne.Type,
			// RunStart:    &d3,
		}
		if err = store.PutJob(ctx, updatedJobOne); err != nil {
			t.Errorf("putting job one: %s", err)
		}

		if jobs, err = store.ListJobs(ctx, 1, 1); err != nil {
			t.Fatal(err)
		}
		if len(jobs) != 1 {
			t.Fatal("expected limit 1 length to equal 1")
		}
		if diff := compareJob(jobTwo, jobs[0]); diff != "" {
			t.Errorf("jobTwo mismatch (-want +got):\n%s", diff)
		}

		job, err := store.GetJob(ctx, updatedJobOne.ID)
		if err != nil {
			t.Fatal(err)
		}
		if diff := compareJob(updatedJobOne, job); diff != "" {
			t.Errorf("updated jobOne mismatch (-want +got):\n%s", diff)
		}

		if err = store.DeleteJob(ctx, updatedJobOne.Name); err != nil {
			t.Error(err)
		}
		if err = store.DeleteJob(ctx, jobTwo.Name); err != nil {
			t.Error(err)
		}
		if err = store.DeleteJob(ctx, jobThree.Name); err != nil {
			t.Error(err)
		}

		if jobs, err = store.ListJobs(ctx, 0, -1); err != nil {
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

	t.Run("TestJobStoreValidPut", func(t *testing.T) {
		r1h := mustRepeatingInterval("R/PT1H")
		bad := []struct {
			description string
			job         *Job
		}{
			{"empty", &Job{}},
			{"no name", &Job{Periodicity: r1h, Type: JTDataset}},
			{"no periodicity", &Job{Name: "some_name", Type: JTDataset}},
			{"no type", &Job{Name: "some_name", Periodicity: r1h}},

			{"invalid periodicity", &Job{Name: "some_name", Type: JTDataset}},
			{"invalid JobType", &Job{Name: "some_name", Periodicity: r1h, Type: JobType("huh")}},
		}

		store := newStore()
		for i, c := range bad {
			if err := store.PutJob(ctx, c.job); err == nil {
				t.Errorf("bad case %d %s: expected error, got nil", i, c.description)
			}
		}
	})

	t.Run("TestJobStoreConcurrentUse", func(t *testing.T) {
		t.Skip("TODO (b5)")
	})
}
