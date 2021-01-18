package cron

import (
	"encoding/json"
	"fmt"
	"sort"
	"time"

	"github.com/ipfs/go-cid"
	"github.com/multiformats/go-multihash"
	"github.com/qri-io/iso8601"
)

const (
	// JobMulticodecType is a CID prefix for cron.Job content identifiers
	// TODO(b5) - using a dummy codec number for now. Pick a real one!
	JobMulticodecType = 2000
	// multihashCodec defines the hashing algorithm this package uses when
	// calculating identifiers
	// multihashCodec = multihash.BLAKE2B_MIN + 256
	multihashCodec = multihash.SHA2_256
)

// jobID returns CID string with a CronJobCodecType prefix
func jobID(ownerID, dsID string) (string, error) {
	mh, err := multihash.Encode([]byte(ownerID+"."+dsID), multihashCodec)
	if err != nil {
		return "", err
	}
	return cid.NewCidV1(JobMulticodecType, multihash.Multihash(mh)).String(), nil
}

// zero is a "constant" representing an empty repeating interval
// TODO (b5) - add a IsZero methods to iso8601 structs
var zero iso8601.RepeatingInterval

// JobType is a type for distinguishing between two different kinds of JobSet
// JobType should be used as a shorthand for defining how to execute a job
type JobType string

const (
	// JTDataset indicates a job that RunSet "qri update" on a dataset specified
	// by Job Name. The job periodicity is determined by the specified dataset's
	// Meta.AccrualPeriodicity field. LastRun should closely match the datasets's
	// latest Commit.Timestamp value
	JTDataset JobType = "dataset"
	// JTShellScript represents a shell script to be run locally, which might
	// update one or more datasets. A non-zero exit code from shell script
	// indicates the job failed to execute properly
	JTShellScript JobType = "shell"
)

// Enum returns the enumerated representation of a JobType
func (jt JobType) Enum() int8 {
	switch jt {
	case JTDataset:
		return 1
	case JTShellScript:
		return 2
	default:
		// "unknown"
		return 0
	}
}

// Job represents a "cron job" that can be scheduled for repeated execution at
// a specified Periodicity (time interval)
type Job struct {
	ID          string                    `json:"id"`                // CID string
	DatasetID   string                    `json:"datasetId"`         // dataset identifier
	OwnerID     string                    `json:"ownerId"`           // user that created this job
	Name        string                    `json:"name"`              // human dataset name eg: "b5/world_bank_population"
	Created     time.Time                 `json:"created"`           // date job was created
	Periodicity iso8601.RepeatingInterval `json:"periodicity"`       // how frequently to run this job
	RunCount    int                       `json:"runCount"`          // number of times this job has been run
	Type        JobType                   `json:"type"`              // distinguish run type
	Options     Options                   `json:"options,omitempty"` // job configuration

	Paused         bool       `json:"paused"`               // if true, job will not generate new run starts
	LatestRunStart *time.Time `json:"latestRunStart"`       // time job last started
	NextRunStart   *time.Time `json:"nextRunStart"`         // earliest possible instant job should run at
	CurrentRun     *Run       `json:"currentRun,omitempty"` // optional currently executing run
}

// NewJob constructs a job pointer
func NewJob(name, ownerID, datasetID string, t JobType, periodicityString string) (*Job, error) {
	p, err := iso8601.ParseRepeatingInterval(periodicityString)
	if err != nil {
		return nil, err
	}
	if t != JTDataset && t != JTShellScript {
		return nil, fmt.Errorf("invalid job type: %q", t)
	}

	id, err := jobID(ownerID, datasetID)
	if err != nil {
		return nil, err
	}

	return &Job{
		ID:          id,
		OwnerID:     ownerID,
		DatasetID:   datasetID,
		Name:        name,
		Created:     NowFunc(),
		Periodicity: p,
	}, nil
}

// Advance creates a new run, increments the run count, and sets the next
// execution wall
func (j *Job) Advance() (err error) {
	j.CurrentRun, err = NewRun(j.ID, j.RunCount+1)
	if err != nil {
		return err
	}
	j.RunCount++
	j.LatestRunStart = j.CurrentRun.Start
	j.Periodicity = j.Periodicity.NextRep()
	j.NextRunStart = j.NextExecutionWall()
	return nil
}

// NextExecutionWall returns the next time execution wall
func (job *Job) NextExecutionWall() *time.Time {
	if job.Paused {
		return nil
	}
	if job.LatestRunStart != nil {
		t := job.Periodicity.After(*job.LatestRunStart)
		return &t
	}

	t := job.Periodicity.After(job.Created)
	return &t
}

// Copy creates a copy of a job
func (job *Job) Copy() *Job {
	cp := &Job{
		ID:             job.ID,
		DatasetID:      job.DatasetID,
		OwnerID:        job.OwnerID,
		Name:           job.Name,
		Created:        job.Created,
		Type:           job.Type,
		Periodicity:    job.Periodicity,
		Paused:         job.Paused,
		RunCount:       job.RunCount,
		LatestRunStart: job.LatestRunStart,
		NextRunStart:   job.NextRunStart,
	}

	if job.CurrentRun != nil {
		cp.CurrentRun = job.CurrentRun.Copy()
	}
	if job.Options != nil {
		cp.Options = job.Options
	}

	return cp
}

// JobSet is a collection of Jobs that implements the sort.Interface,
// sorting a list of JobSet in reverse-chronological-then-alphabetical order
type JobSet struct {
	set []*Job
}

// NewJobSet constructs a job set.
func NewJobSet() *JobSet {
	return &JobSet{}
}

func (js JobSet) Len() int { return len(js.set) }
func (js JobSet) Less(i, j int) bool {
	return lessNilTime(js.set[i].NextRunStart, js.set[j].NextRunStart)
}
func (js JobSet) Swap(i, j int) { js.set[i], js.set[j] = js.set[j], js.set[i] }

func (js *JobSet) Add(j *Job) {
	if js == nil {
		*js = JobSet{set: []*Job{j}}
		return
	}

	for i, job := range js.set {
		if job.ID == j.ID {
			js.set[i] = j
			return
		}
	}
	js.set = append(js.set, j)
	sort.Sort(js)
}

func (js *JobSet) Remove(id string) (removed bool) {
	for i, job := range js.set {
		if job.ID == id {
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

// MarshalJSON serializes JobSet to an array of Jobs
func (js JobSet) MarshalJSON() ([]byte, error) {
	return json.Marshal(js.set)
}

// UnmarshalJSON deserializes from a JSON array
func (js *JobSet) UnmarshalJSON(data []byte) error {
	set := []*Job{}
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

// Options is an interface for job options
type Options interface {
}

// ShellScriptOptions encapsulates options for running a shell script cron job
type ShellScriptOptions struct {
	// none yet.
}

// DatasetOptions encapsulates options passed to `qri save`
// TODO (b5) - we should contribute flexbuffer support for golang & remove this entirely
type DatasetOptions struct {
	Title     string
	Message   string
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
