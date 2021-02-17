package scheduler

import (
	"testing"
)

func TestCronHTTP(t *testing.T) {
	// store := NewMemStore()

	// factory := func(context.Context) RunWorkflowFunc {
	// 	return func(ctx context.Context, streams ioes.IOStreams, workflow *Workflow) error {
	// 		return nil
	// 	}
	// }

	// cliCtx := context.Background()
	// cli := HTTPClient{Addr: ":7897"}
	// if err := cli.Ping(); err != ErrUnreachable {
	// 	t.Error("expected ping to server that is off to return ErrUnreachable")
	// }

	// cr := NewCron(store, factory, event.NilBus)
	// // TODO (b5) - how do we keep this from being a leaking goroutine?
	// go cr.ServeHTTP(":7897")

	// time.Sleep(time.Millisecond * 100)
	// if err := cli.Ping(); err != nil {
	// 	t.Errorf("expected ping to active server to not fail. got: %s", err)
	// }

	// workflows, err := cli.ListWorkflows(cliCtx, 0, -1)
	// if err != nil {
	// 	t.Fatal(err)
	// }
	// if len(workflows) != 0 {
	// 	t.Error("expected 0 workflows")
	// }

	// // d := time.Date(2019, 1, 1, 0, 0, 0, 0, time.UTC)
	// dsWorkflow := &Workflow{
	// 	Name: "b5/libp2p_node_count",
	// 	Type: JTDataset,
	// 	// RunStart:    &d,
	// }

	// if err = cli.Schedule(cliCtx, dsWorkflow); err != nil {
	// 	t.Fatal(err.Error())
	// }

	// workflows, err = cli.ListWorkflows(cliCtx, 0, -1)
	// if err != nil {
	// 	t.Fatal(err.Error())
	// }

	// if len(workflows) != 1 {
	// 	t.Error("expected len of workflows to equal 1")
	// }

	// _, err = cli.Workflow(cliCtx, workflows[0].Name)
	// if err != nil {
	// 	t.Fatal(err.Error())
	// }

	// if err := cli.Unschedule(cliCtx, dsWorkflow.Name); err != nil {
	// 	t.Fatal(err)
	// }

	// workflows, err = cli.ListWorkflows(cliCtx, 0, -1)
	// if err != nil {
	// 	t.Fatal(err.Error())
	// }

	// if len(workflows) != 0 {
	// 	t.Error("expected len of workflows to equal 0")
	// }
}
