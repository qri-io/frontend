package update

import (
	"strings"
	"testing"
	"time"

	"github.com/qri-io/dataset"
	"github.com/qri-io/ioes"
	"github.com/qri-io/qrimatic/api"
	"github.com/qri-io/qrimatic/workflow"
)

func TestWorkflowFromDataset(t *testing.T) {
	ds := &dataset.Dataset{
		Peername: "b5",
		Name:     "libp2p_node_count",
		Commit: &dataset.Commit{
			// last update was Jan 1 2019
			Timestamp: time.Date(2019, 1, 1, 0, 0, 0, 0, time.UTC),
		},
		Meta: &dataset.Meta{
			// update once a week
			AccrualPeriodicity: "R/P1W",
		},
	}

	_, err := DatasetToWorkflow(ds, "", nil)
	if err != nil {
		t.Fatal(err)
	}
}

func TestWorkflowFromShellScript(t *testing.T) {
	// ShellScriptToWorkflow(qfs.NewMemfileBytes("test.sh", nil)
}

func TestDatasetWorkflowToCmd(t *testing.T) {
	dsj := &Workflow{
		Type: workflow.JTDataset,
		Name: "me/foo",
		Options: &workflow.DatasetOptions{
			Title:    "title",
			BodyPath: "body/path.csv",
			FilePaths: []string{
				"file/path/0.json",
				"file/path/1.json",
			},
			Message: "message",

			// TODO (b5): we only provide one boolean flag here that affects output.
			// b/c map iteration is randomized, adding more would produce inconsistent
			// strings. full bool flag support should be written as a separate test
			Publish:      true,
			ShouldRender: true,
		},
	}
	streams := ioes.NewDiscardIOStreams()
	cmd := api.WorkflowToCmd(streams, dsj)

	expect := "qri save me/foo --title=title --message=message --body=body/path.csv --file=file/path/0.json --file=file/path/1.json --publish"
	got := strings.Join(cmd.Args, " ")
	if got != expect {
		t.Errorf("workflow string mismatch. expected:\n'%s'\ngot:\n'%s'", expect, got)
	}
}

func TestShellScriptWorkflowToCmd(t *testing.T) {
	dsj := &Workflow{
		Type: workflow.JTShellScript,
		Name: "path/to/shell/script.sh",
	}
	streams := ioes.NewDiscardIOStreams()
	cmd := api.WorkflowToCmd(streams, dsj)

	expect := "path/to/shell/script.sh"
	got := strings.Join(cmd.Args, " ")
	if got != expect {
		t.Errorf("workflow string mismatch. expected:\n'%s'\ngot:\n'%s'", expect, got)
	}
}

func TestShellScriptToWorkflow(t *testing.T) {
	if _, err := ShellScriptToWorkflow("", "", nil); err == nil {
		t.Errorf("expected error")
	}

	if _, err := ShellScriptToWorkflow("testdata/hello.sh", "R/P1Y", nil); err != nil {
		t.Errorf("unexpected error: %s", err)
	}
}
