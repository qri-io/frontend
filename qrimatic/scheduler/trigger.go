package scheduler

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/qri-io/iso8601"
)

type TriggerType string

var (
	TTCron TriggerType = "cron"
)

type Trigger interface {
	Info() TriggerInfo
	ToMap() map[string]interface{}
	Advance(workflow *Workflow) error
}

type TriggerInfo struct {
	// configuration
	ID         string      `json:"id"` // identifier
	WorkflowID string      `json:"workflowId"`
	Type       TriggerType `json:"type"`
	Disabled   bool        `json:"disabled"`

	// orchestration state
	RunCount      int        `json:"runCount"`
	LastRunID     string     `json:"lastRunID,omitempty"`
	LastRunStart  *time.Time `json:"lastRunStart,omitempty"`
	LastRunStatus string     `json:"lastExecutionState"`
}

func newTriggerInfo(m map[string]interface{}) (TriggerInfo, error) {
	ti := TriggerInfo{}
	if id, ok := m["id"].(string); ok && id != "" {
		ti.ID = id
	} else {
		ti.ID = newTriggerID()
	}
	if wid, ok := m["workflowId"].(string); ok {
		ti.WorkflowID = wid
	}
	if t, ok := m["type"].(string); ok {
		ti.Type = TriggerType(t)
	} else {
		return TriggerInfo{}, fmt.Errorf("trigger type field is required")
	}
	if c, ok := m["runCount"].(int); ok {
		ti.RunCount = c
	}
	if d, ok := m["disabled"].(bool); ok {
		ti.Disabled = d
	}

	return ti, nil
}

func (ti TriggerInfo) Info() TriggerInfo {
	return ti
}

func (ti TriggerInfo) toMap() map[string]interface{} {
	return map[string]interface{}{
		"id":            ti.ID,
		"workflowId":    ti.WorkflowID,
		"type":          ti.Type,
		"disabled":      ti.Disabled,
		"runCount":      ti.RunCount,
		"lastRunID":     ti.LastRunID,
		"lastRunStart":  ti.LastRunStart,
		"lastRunStatus": ti.LastRunStatus,
	}
}

type Triggers []Trigger

var (
	_ json.Marshaler   = (*Triggers)(nil)
	_ json.Unmarshaler = (*Triggers)(nil)
)

func (ts Triggers) MarshalJSON() ([]byte, error) {
	items := make([]map[string]interface{}, len(ts))
	for i, t := range ts {
		items[i] = t.ToMap()
	}
	return json.Marshal(items)
}

func (ts *Triggers) UnmarshalJSON(data []byte) error {
	mapped := []map[string]interface{}{}
	if err := json.Unmarshal(data, &mapped); err != nil {
		return err
	}

	triggers := make(Triggers, 0, len(mapped))
	for _, m := range mapped {
		t, err := newTriggerFromMap(m)
		if err != nil {
			return err
		}
		triggers = append(triggers, t)
	}
	*ts = triggers
	return nil
}

func (ts Triggers) CronTriggers() []*CronTrigger {
	crons := make([]*CronTrigger, 0, len(ts))
	for _, t := range ts {
		if ct, ok := t.(*CronTrigger); ok {
			crons = append(crons, ct)
		}
	}
	return crons
}

func newTriggerFromMap(m map[string]interface{}) (Trigger, error) {
	ti, err := newTriggerInfo(m)
	if err != nil {
		return nil, err
	}

	switch ti.Type {
	case TTCron:
		t := &CronTrigger{TriggerInfo: ti}
		ps, ok := m["periodicity"].(string)
		if !ok {
			return nil, fmt.Errorf("invalid cron trigger. expected %s to be a string type", "periodicity")
		}
		p, err := iso8601.ParseRepeatingInterval(ps)
		if err != nil {
			return nil, fmt.Errorf("invalid cron trigger. %s: %w", "periodicity", err)
		}
		t.Periodicity = p

		if ss, ok := m["nextRunStart"].(string); ok {
			ts, err := time.Parse(time.RFC3339, ss)
			if err != nil {
				return nil, fmt.Errorf("invalid cron trigger. %q: %w", "nextRunStart", err)
			}
			t.NextRunStart = &ts
		}

		return t, nil
	default:
		return nil, fmt.Errorf("unknown trigger type %q", ti.Type)
	}
}

func newTriggerID() string {
	return uuid.New().String()
}

type CronTrigger struct {
	TriggerInfo
	Start        time.Time                 `json:"start"`
	Periodicity  iso8601.RepeatingInterval `json:"periodicity"`  // how frequently to run this job
	NextRunStart *time.Time                `json:"nextRunStart"` // earliest possible instant job should run at
}

func NewCronTrigger(workflowID string, start time.Time, p iso8601.RepeatingInterval) *CronTrigger {
	next := p.After(start)
	return &CronTrigger{
		TriggerInfo: TriggerInfo{
			ID:         newTriggerID(),
			WorkflowID: workflowID,
			Type:       TTCron,
		},
		Start:        start,
		Periodicity:  p,
		NextRunStart: &next,
	}
}

func (t *CronTrigger) ToMap() map[string]interface{} {
	m := t.toMap()
	m["periodicity"] = t.Periodicity
	m["nextRunStart"] = t.NextRunStart
	m["start"] = t.Start
	return m
}

func (t *CronTrigger) Advance(workflow *Workflow) error {
	t.RunCount++
	t.Periodicity = t.Periodicity.NextRep()
	t.LastRunStart = workflow.LatestStart
	// synchronize clocks on advance to avoid
	// the scheduler trying to make up for the missed ticks
	t.NextRunStart = t.LastRunStart
	t.NextRunStart = t.NextExecutionWall()

	t.LastRunID = workflow.CurrentRun.ID
	// TODO(arqu): t.LastRunStatus = workflow.?
	return nil
}

// NextExecutionWall returns the next time execution wall
func (t *CronTrigger) NextExecutionWall() *time.Time {
	if t.Disabled {
		return nil
	}
	if t.NextRunStart != nil {
		next := t.Periodicity.After(*t.NextRunStart)
		return &next
	}

	next := t.Periodicity.After(t.Start)
	return &next
}
