package scheduler

import (
	"context"
	"sync"
	"testing"
	"time"

	"github.com/google/go-cmp/cmp"
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
	workflow := &Workflow{
		Name:      "b5/libp2p_node_count",
		DatasetID: "dsID",
		OwnerID:   "ownerID",
		Type:      JTDataset,
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
		Name: "b5/libp2p_node_count",
		Type: JTDataset,
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
		Name: "foo.sh",
		Type: JTShellScript,
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
		Name: "foo.sh",
		Type: JTShellScript,
		// RunNumber: 1,
		// RunStart:  got.RunStart,
		// RunStop:   got.RunStop,
	}

	if diff := compareWorkflow(expect, got); diff != "" {
		t.Errorf("log workflow mismatch (-want +got):\n%s", diff)
	}
}

func TestRunWorkflow(t *testing.T) {
	ctx := context.Background()

	expectedEvents := []event.Type{
		ETWorkflowStarted,
		ETWorkflowCompleted,
	}

	gotEvents := []event.Type{}
	gotEventLock := sync.Mutex{}
	sent := make(chan struct{})
	done := make(chan struct{})

	go func() {
		eventsSent := 0
		for {
			select {
			case <-sent:
				eventsSent++
				if eventsSent == len(expectedEvents) {
					done <- struct{}{}
					return
				}
			case <-time.After(2 * time.Second):
				done <- struct{}{}
			}
		}
	}()

	bus := event.NewBus(ctx)
	handler := func(ctx context.Context, e event.Event) error {
		switch e.Type {
		case ETWorkflowStarted:
			w, ok := e.Payload.(*Workflow)
			if !ok {
				t.Fatalf("expected `ETWorkflowStarted` event to emit a *Workflow payload")
			}
			if w.Status != StatusRunning {
				t.Errorf("expected `ETWorkflowStarted` event to emit a workflow with status 'running', got %q", w.Status)
			}
			if w.LatestStart == nil {
				t.Errorf("expected `ETWorkflowStarted` event to emit a workflow with a `LatestStart`")
			}
			if w.LatestEnd != nil {
				t.Errorf("expected `ETworkflowStarted` event to emit a workflow with no `LatestEnd`, as the workflow is currently running")
			}
			gotEventLock.Lock()
			gotEvents = append(gotEvents, e.Type)
			gotEventLock.Unlock()
			sent <- struct{}{}
		case ETWorkflowCompleted:
			w, ok := e.Payload.(*Workflow)
			if !ok {
				t.Fatalf("expected `ETWorkflowCompleted` event to emit a *Workflow payload")
			}
			if w.Status != StatusSucceeded {
				t.Errorf("expected `ETWorkflowCompleted` event to emit a workflow with status 'succeeded', got %q", w.Status)
			}
			if w.LatestEnd == nil {
				t.Errorf("expected `ETworkflowStarted` event to emit a workflow with a `LatestEnd`")
			}
			gotEventLock.Lock()
			gotEvents = append(gotEvents, e.Type)
			gotEventLock.Unlock()
			sent <- struct{}{}
		default:
			t.Fatalf("unexpected event type: %s", e.Type)
		}
		return nil
	}
	bus.SubscribeTypes(handler, ETWorkflowStarted, ETWorkflowCompleted)

	memStore := NewMemStore(event.NilBus)
	testFunc := func(ctx context.Context, streams ioes.IOStreams, workflow *Workflow) error {
		return nil
	}
	testFact := func(ctx context.Context) (runner RunWorkflowFunc) {
		return testFunc
	}
	c := NewCron(
		memStore,
		testFact,
		bus,
	)
	wf, err := NewCronWorkflow("test_workflow", "test_ownerID", "test_datasetID", "R/PT1H")
	if err != nil {
		t.Fatalf("unexpected error making new cron workflow: %s", err)
	}
	c.RunWorkflow(ctx, wf, "")

	<-done
	if diff := cmp.Diff(expectedEvents, gotEvents); diff != "" {
		t.Errorf("result mismatch (-want +got):\n%s", diff)
	}
}
