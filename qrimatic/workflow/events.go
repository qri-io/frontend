package workflow

import "github.com/qri-io/qri/event"

const (
	// ETWorkflowScheduled fires when a workflow is registered for updating, or
	// when a scheduled workflow changes
	// payload is a Workflow
	// subscriptions do not block the publisher
	ETWorkflowScheduled = event.Type("cron:WorkflowScheduled")
	// ETWorkflowUnscheduled fires when a workflow is removed from the update
	// schedule payload is a Workflow
	// subscriptions do not block the publisher
	ETWorkflowUnscheduled = event.Type("cron:WorkflowUnscheduled")
	// ETWorkflowStarted fires when a workflow has started running
	// payload is a Workflow
	// subscriptions do not block the publisher
	ETWorkflowStarted = event.Type("cron:WorkflowStarted")
	// ETWorkflowCompleted fires when a workflow has finished running
	// payload is a Workflow
	// subscriptions do not block the publisher
	ETWorkflowCompleted = event.Type("cron:WorkflowCompleted")
	// ETWorkflowUpdated fires when a workflow has updated
	// its configuration
	ETWorkflowUpdated = event.Type("cron:WorkflowUpdated")
)
