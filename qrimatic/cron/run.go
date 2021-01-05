package cron

import (
	"encoding/json"
	"fmt"
	"sort"
	"time"

	"github.com/ipfs/go-cid"
	"github.com/multiformats/go-multihash"
)

// RunMulticodecType is a CID prefix for cron.Run content identifiers
// TODO(b5) - using a dummy codec number for now. Pick a real one!
const RunMulticodecType = 2200

func runID(jobID string, created time.Time) (string, error) {
	str := fmt.Sprintf("%s.%d", jobID, created.UnixNano())
	mh, err := multihash.Encode([]byte(str), multihashCodec)
	if err != nil {
		return "", err
	}
	return cid.NewCidV1(RunMulticodecType, multihash.Multihash(mh)).String(), nil
}

// Run is a record of job execution
// RunSet have one of three execution states, which describe it's position in
// the execution lifecycle:
// * unexected: job.RunStart == nil && job.RunSettop == nil
// * executing: !job.RunStart == nil && job.RunSettop == nil
// * completed: !job.RunStart == nil && !job.RunSettop == nil
type Run struct {
	ID          string     `json:"ID"`
	JobID       string     `json:"jobID"`
	Number      int        `json:"number"`
	Start       *time.Time `json:"start"`
	Stop        *time.Time `json:"stop"`
	Error       string     `json:"error,omitempty"`
	LogFilePath string     `json:"logFilePath,omitempty"`
}

// NewRun constructs a run pointer
func NewRun(jobID string, number int) (*Run, error) {
	created := NowFunc()
	id, err := runID(jobID, created)
	if err != nil {
		return nil, err
	}

	return &Run{
		ID:     id,
		JobID:  jobID,
		Number: number,
		Start:  &created,
	}, nil
}

// Copy allocates a new Run pointer with all fields set to the value of the
// receiver
func (r *Run) Copy() *Run {
	if r == nil {
		return nil
	}
	return &Run{
		Number:      r.Number,
		Start:       r.Start,
		Stop:        r.Stop,
		Error:       r.Error,
		LogFilePath: r.LogFilePath,
	}
}

// LogName returns a canonical name string for a run that's executed and saved
// to a logging system
func (r *Run) LogName() string {
	return fmt.Sprintf("%s-%d", r.JobID, r.Number)
}

// RunSet is a list of RunSet that implements the sort.Interface, sorting a list
// of RunSet in reverse-chronological-then-alphabetical order
type RunSet struct {
	set []*Run
}

// NewRunSet constructs a RunSet.
func NewRunSet() *RunSet {
	return &RunSet{}
}

func (rs RunSet) Len() int { return len(rs.set) }
func (rs RunSet) Less(i, j int) bool {
	return lessNilTime(rs.set[i].Start, rs.set[j].Start)
}
func (rs RunSet) Swap(i, j int) { rs.set[i], rs.set[j] = rs.set[j], rs.set[i] }

func (rs *RunSet) Add(r *Run) {
	if rs == nil {
		*rs = RunSet{set: []*Run{r}}
		return
	}

	for i, run := range rs.set {
		if run.ID == r.ID {
			rs.set[i] = r
			return
		}
	}
	rs.set = append(rs.set, r)
	sort.Sort(rs)
}

func (rs *RunSet) Remove(id string) (removed bool) {
	for i, run := range rs.set {
		if run.ID == id {
			if i+1 == len(rs.set) {
				rs.set = rs.set[:i]
				return true
			}

			rs.set = append(rs.set[:i], rs.set[i+1:]...)
			return true
		}
	}
	return false
}

// MarshalJSON serializes RunSet to an array of Jobs
func (rs RunSet) MarshalJSON() ([]byte, error) {
	return json.Marshal(rs.set)
}

// UnmarshalJSON deserializes from a JSON array
func (rs *RunSet) UnmarshalJSON(data []byte) error {
	set := []*Run{}
	if err := json.Unmarshal(data, &set); err != nil {
		return err
	}
	rs.set = set
	return nil
}
