package scheduler

import (
	"encoding/json"
	"sort"
	"time"

	"github.com/google/uuid"
	"github.com/multiformats/go-multihash"
	"github.com/qri-io/iso8601"
	"github.com/qri-io/qri/dsref"
)

// WorkflowType is a type for distinguishing between two different kinds of WorkflowSet
// WorkflowType should be used as a shorthand for defining how to execute a workflow
type WorkflowType string

const (
	// JTDataset indicates a workflow that RunSet "qri update" on a dataset specified
	// by Workflow Name. The workflow periodicity is determined by the specified dataset's
	// Meta.AccrualPeriodicity field. LastRun should closely match the datasets's
	// latest Commit.Timestamp value
	JTDataset WorkflowType = "dataset"
	// JTShellScript represents a shell script to be run locally, which might
	// update one or more datasets. A non-zero exit code from shell script
	// indicates the workflow failed to execute properly
	JTShellScript WorkflowType = "shell"
)

const (
	// WorkflowMulticodecType is a CID prefix for cron.Workflow content
	// identifiers
	// TODO(b5) - using a dummy codec number for now. Pick a real one!
	WorkflowMulticodecType = 2000
	// multihashCodec defines the hashing algorithm this package uses when
	// calculating identifiers
	// multihashCodec = multihash.BLAKE2B_MIN + 256
	multihashCodec = multihash.SHA2_256
)

// workflowID returns CID string with a CronWorkflowCodecType prefix
func workflowID() string {
	return uuid.New().String()
}

// zero is a "constant" representing an empty repeating interval
// TODO (b5) - add a IsZero methods to iso8601 structs
var zero iso8601.RepeatingInterval

// Workflow represents a "cron workflow" that can be scheduled for repeated execution at
// a specified Periodicity (time interval)
type Workflow struct {
	ID        string     `json:"id"`                // CID string
	DatasetID string     `json:"datasetID"`         // dataset identifier
	OwnerID   string     `json:"ownerID"`           // user that created this workflow
	Name      string     `json:"name"`              // human dataset name eg: "b5/world_bank_population"
	Created   *time.Time `json:"created"`           // date workflow was created
	RunCount  int        `json:"runCount"`          // number of times this workflow has been run
	Options   Options    `json:"options,omitempty"` // workflow configuration

	Disabled       bool       `json:"disabled"`             // if true, workflow will not generate new run starts
	LatestRunStart *time.Time `json:"latestRunStart"`       // time workflow last started
	CurrentRun     *Run       `json:"currentRun,omitempty"` // optional currently executing run

	Triggers   Triggers `json:"triggers"`   // things that can initiate a run
	OnComplete Hooks    `json:"onComplete"` // things to do after a run executes

	VersionInfo dsref.VersionInfo `json:"versionInfo"` // optional versionInfo of DatasetID field

	Type WorkflowType `json:"type"` // distinguish run type
}

// NewCronWorkflow constructs a workflow pointer with a cron trigger
func NewCronWorkflow(name, ownerID, datasetID string, periodicityString string) (*Workflow, error) {
	p, err := iso8601.ParseRepeatingInterval(periodicityString)
	if err != nil {
		return nil, err
	}

	id := workflowID()

	t := NowFunc()
	return &Workflow{
		ID:        id,
		OwnerID:   ownerID,
		DatasetID: datasetID,
		Name:      name,
		Created:   &t,
		Triggers: Triggers{
			NewCronTrigger(id, t, p),
		},

		Type: JTDataset,
	}, nil
}

func (workflow *Workflow) Complete(ds *dsref.Ref, ownerID string) error {
	workflow.Name = ds.Human()
	//TODO (arqu): expand this as this version info is very shallow
	workflow.VersionInfo = ds.VersionInfo()
	now := time.Now()
	workflow.Created = &now
	workflow.Type = JTDataset
	workflow.OwnerID = ownerID
	return nil
}

// Advance creates a new run, increments the run count, and sets the next
// execution wall
func (workflow *Workflow) Advance(triggerID string) (err error) {
	workflow.CurrentRun, err = NewRun(workflow.ID, workflow.RunCount+1)
	if err != nil {
		return err
	}
	workflow.RunCount++
	workflow.LatestRunStart = workflow.CurrentRun.Start

	if triggerID != "" {
		for _, t := range workflow.Triggers {
			if t.Info().ID == triggerID {
				t.Advance(workflow)
			}
		}
	}
	return nil
}

// Copy creates a copy of a workflow
func (workflow *Workflow) Copy() *Workflow {
	cp := &Workflow{
		ID:             workflow.ID,
		DatasetID:      workflow.DatasetID,
		OwnerID:        workflow.OwnerID,
		Name:           workflow.Name,
		Created:        workflow.Created,
		Disabled:       workflow.Disabled,
		RunCount:       workflow.RunCount,
		LatestRunStart: workflow.LatestRunStart,
		Triggers:       workflow.Triggers,
		OnComplete:     workflow.OnComplete,
		VersionInfo:    workflow.VersionInfo,
		Type:           workflow.Type,
	}

	if workflow.CurrentRun != nil {
		cp.CurrentRun = workflow.CurrentRun.Copy()
	}
	if workflow.Options != nil {
		cp.Options = workflow.Options
	}

	return cp
}

// WorkflowSet is a collection of Workflows that implements the sort.Interface,
// sorting a list of WorkflowSet in reverse-chronological-then-alphabetical order
type WorkflowSet struct {
	set []*Workflow
}

// NewWorkflowSet constructs a workflow set.
func NewWorkflowSet() *WorkflowSet {
	return &WorkflowSet{}
}

func (js WorkflowSet) Len() int { return len(js.set) }
func (js WorkflowSet) Less(i, j int) bool {
	return lessNilTime(js.set[i].LatestRunStart, js.set[j].LatestRunStart)
}
func (js WorkflowSet) Swap(i, j int) { js.set[i], js.set[j] = js.set[j], js.set[i] }

func (js *WorkflowSet) Add(j *Workflow) {
	if js == nil {
		*js = WorkflowSet{set: []*Workflow{j}}
		return
	}

	for i, workflow := range js.set {
		if workflow.ID == j.ID {
			js.set[i] = j
			return
		}
	}
	js.set = append(js.set, j)
	sort.Sort(js)
}

func (js *WorkflowSet) Remove(id string) (removed bool) {
	for i, workflow := range js.set {
		if workflow.ID == id {
			if i+1 == len(js.set) {
				js.set = js.set[:i]
				return true
			}

			js.set = append(js.set[:i], js.set[i+1:]...)
			return true
		}
	}
	return false
}

// MarshalJSON serializes WorkflowSet to an array of Workflows
func (js WorkflowSet) MarshalJSON() ([]byte, error) {
	return json.Marshal(js.set)
}

// UnmarshalJSON deserializes from a JSON array
func (js *WorkflowSet) UnmarshalJSON(data []byte) error {
	set := []*Workflow{}
	if err := json.Unmarshal(data, &set); err != nil {
		return err
	}
	js.set = set
	return nil
}

func lessNilTime(a, b *time.Time) bool {
	if a == nil && b != nil {
		return true
	} else if a != nil && b == nil {
		return false
	} else if a == nil && b == nil {
		return false
	}
	return a.After(*b)
}

type OptionsType string

const (
	OTDataset OptionsType = "dataset"
	OTShell   OptionsType = "shell"
)

// Options is an interface for workflow options
type Options interface {
}

// ShellScriptOptions encapsulates options for running a shell script cron workflow
type ShellScriptOptions struct {
	// none yet.
}

// DatasetOptions encapsulates options passed to `qri save`
// TODO (b5) - we should contribute flexbuffer support for golang & remove this entirely
type DatasetOptions struct {
	Title     string
	Message   string
	Recall    string
	BodyPath  string
	FilePaths []string

	Publish             bool
	Strict              bool
	Force               bool
	ConvertFormatToPrev bool
	ShouldRender        bool

	Config  map[string]string
	Secrets map[string]string
}
