package scheduler

import (
	"context"
	"testing"
	"time"

	"github.com/qri-io/ioes"
	"github.com/qri-io/iso8601"
	"github.com/qri-io/qri/event"
)

func mustRepeatingInterval(s string) iso8601.RepeatingInterval {
	ri, err := iso8601.ParseRepeatingInterval(s)
	if err != nil {
		panic(err)
	}
	return ri
}

func TestCronDataset(t *testing.T) {
	updateCount := 0
	next := time.Now().Add(time.Millisecond * 20)
	workflow := &Workflow{
		Name:         "b5/libp2p_node_count",
		DatasetID:    "dsID",
		OwnerID:      "ownerID",
		Type:         JTDataset,
		Periodicity:  mustRepeatingInterval("R/P1W"),
		NextRunStart: &next,
	}

	factory := func(outer context.Context) RunWorkflowFunc {
		return func(ctx context.Context, streams ioes.IOStreams, workflow *Workflow) error {
			switch workflow.Type {
			case JTDataset:
				updateCount++
				return nil
			}
			t.Fatalf("runner called with invalid workflow: %v", workflow)
			return nil
		}
	}

	ctx, cancel := context.WithTimeout(context.Background(), time.Millisecond*500)
	defer cancel()

	store := NewMemStore()
	cron := NewCronInterval(store, factory, event.NilBus, time.Millisecond*50)
	if err := cron.Schedule(ctx, workflow); err != nil {
		t.Fatal(err)
	}

	if err := cron.Start(ctx); err != nil {
		t.Fatal(err)
	}

	<-ctx.Done()

	expectedUpdateCount := 1
	if expectedUpdateCount != updateCount {
		t.Errorf("update ran wrong number of times. expected: %d, got: %d", expectedUpdateCount, updateCount)
	}

	logs, err := store.ListWorkflows(ctx, 0, -1)
	if err != nil {
		t.Fatal(err)
	}
	if len(logs) != 1 {
		t.Fatalf("log length mismatch. expected: %d, got: %d", 1, len(logs))
	}

	got := logs[0]

	expect := &Workflow{
		Name:        "b5/libp2p_node_count",
		Type:        JTDataset,
		Periodicity: mustRepeatingInterval("R/P1W"),
		// RunNumber: 1,
		// RunStart:  got.RunStart,
		// RunStop:   got.RunStop,
	}

	if diff := compareWorkflow(expect, got); diff != "" {
		t.Errorf("log workflow mismatch (-want +got):\n%s", diff)
	}
}

func TestCronShellScript(t *testing.T) {
	pdci := DefaultCheckInterval
	defer func() { DefaultCheckInterval = pdci }()
	DefaultCheckInterval = time.Millisecond * 50

	updateCount := 0

	workflow := &Workflow{
		Name:        "foo.sh",
		Type:        JTShellScript,
		Periodicity: mustRepeatingInterval("R/P1W"),
	}

	// scriptRunner := LocalShellScriptRunner("testdata")
	factory := func(outer context.Context) RunWorkflowFunc {
		return func(ctx context.Context, streams ioes.IOStreams, workflow *Workflow) error {
			switch workflow.Type {
			case JTShellScript:
				updateCount++
				return nil
			}
			t.Fatalf("runner called with invalid workflow: %v", workflow)
			return nil
		}
	}

	ctx, cancel := context.WithTimeout(context.Background(), time.Millisecond*500)
	defer cancel()

	store := NewMemStore()
	cron := NewCron(store, factory, event.NilBus)
	if err := cron.Schedule(ctx, workflow); err != nil {
		t.Fatal(err)
	}

	if err := cron.Start(ctx); err != nil {
		t.Fatal(err)
	}

	<-ctx.Done()

	expectedUpdateCount := 1
	if expectedUpdateCount != updateCount {
		t.Fatalf("update ran wrong number of times. expected: %d, got: %d", expectedUpdateCount, updateCount)
	}

	logs, err := store.ListWorkflows(ctx, 0, -1)
	if err != nil {
		t.Fatal(err)
	}
	if len(logs) != 1 {
		t.Errorf("log length mismatch. expected: %d, got: %d", 1, len(logs))
	}

	got := logs[0]

	expect := &Workflow{
		Name:        "foo.sh",
		Type:        JTShellScript,
		Periodicity: mustRepeatingInterval("R/P1W"),

		// RunNumber: 1,
		// RunStart:  got.RunStart,
		// RunStop:   got.RunStop,
	}

	if diff := compareWorkflow(expect, got); diff != "" {
		t.Errorf("log workflow mismatch (-want +got):\n%s", diff)
	}
}
