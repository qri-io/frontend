// Package update defines the update service
package update

import (
	"bytes"
	"fmt"
	"path/filepath"
	"strings"

	golog "github.com/ipfs/go-log"
	"github.com/qri-io/dataset"
	"github.com/qri-io/qrimatic/scheduler"
)

var log = golog.Logger("update")

func init() {
	golog.SetLogLevel("update", "debug")
}

// PossibleShellScript checks a path to see if it might be a shell script
// TODO (b5) - deal with platforms that don't use '.sh' as a script extension (windows?)
func PossibleShellScript(path string) bool {
	return filepath.Ext(path) == ".sh"
}

// DatasetToWorkflow converts a dataset to scheduler.Workflow
func DatasetToWorkflow(ds *dataset.Dataset, periodicity string, opts *scheduler.DatasetOptions) (workflow *scheduler.Workflow, err error) {
	if periodicity == "" && ds.Meta != nil && ds.Meta.AccrualPeriodicity != "" {
		periodicity = ds.Meta.AccrualPeriodicity
	}

	if periodicity == "" {
		return nil, fmt.Errorf("scheduling dataset updates requires a meta component with accrualPeriodicity set")
	}

	name := fmt.Sprintf("%s/%s", ds.Peername, ds.Name)
	workflow, err = scheduler.NewCronWorkflow(name, "ownerID", name, periodicity)
	if err != nil {
		log.Debugw("creating new workflow", "error", err)
		return nil, err
	}
	if ds.Commit != nil {
		workflow.LatestRunStart = &ds.Commit.Timestamp
	}
	if opts != nil {
		workflow.Options = opts
	}
	// err = workflow.Validate()

	return
}

// ShellScriptToWorkflow turns a shell script into scheduler.Workflow
func ShellScriptToWorkflow(path string, periodicity string, opts *scheduler.ShellScriptOptions) (workflow *scheduler.Workflow, err error) {
	// // TODO (b5) - confirm file exists & is executable

	// workflow, err = scheduler.NewWorkflow(path, "foo", path, scheduler.JTShellScript, periodicity)
	// if err != nil {
	// 	return nil, err
	// }

	// if opts != nil {
	// 	workflow.Options = opts
	// }
	return
}

func processWorkflowError(workflow *scheduler.Workflow, errOut *bytes.Buffer, err error) error {
	if err == nil {
		return nil
	}

	if workflow.Type == scheduler.JTDataset && errOut != nil {
		// TODO (b5) - this should be a little more stringent :(
		if strings.Contains(errOut.String(), "no changes to save") {
			// TODO (b5) - this should be a concrete error declared in dsfs:
			// dsfs.ErrNoChanges
			return fmt.Errorf("no changes to save")
		}
	}

	return err
}
