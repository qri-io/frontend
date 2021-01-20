package scheduler

import (
	"time"

	"github.com/qri-io/iso8601"
)

type Trigger interface {
	GetWorkflowID() string
	Type() string
	Value() map[string]interface{}
}

type CronTrigger struct {
	WorkflowID   string                    `json:"workflowId,omitempty"`
	Periodicity  iso8601.RepeatingInterval `json:"periodicity"`  // how frequently to run this job
	NextRunStart *time.Time                `json:"nextRunStart"` // earliest possible instant job should run at
}
