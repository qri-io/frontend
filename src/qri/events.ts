
// ETCreatedNewFile is the event for creating a new file
export const ETCreatedNewFile = "watchfs:CreatedNewFile"
// ETModifiedFile is the event for modifying a file
export const ETModifiedFile = "watchfs:ModifiedFile"
// ETDeletedFile is the event for deleting a file
export const ETDeletedFile = "watchfs:DeletedFile"
// ETRemoteClientPushVersionProgress indicates a change in progress of a
// dataset version push. Progress can fire as much as once-per-block.
// subscriptions do not block the publisher
// payload will be a RemoteEvent
export const ETRemoteClientPushVersionProgress = "remoteClient:PushVersionProgress"
// ETRemoteClientPushVersionCompleted indicates a version successfully pushed
// to a remote.
// payload will be a RemoteEvent
export const ETRemoteClientPushVersionCompleted = "remoteClient:PushVersionCompleted"
// ETRemoteClientPushDatasetCompleted indicates pushing a dataset
// (logbook + versions) completed
// payload will be a RemoteEvent
export const ETRemoteClientPushDatasetCompleted = "remoteClient:PushDatasetCompleted"
// ETRemoteClientPullVersionProgress indicates a change in progress of a
// dataset version pull. Progress can fire as much as once-per-block.
// subscriptions do not block the publisher
// payload will be a RemoteEvent
export const ETRemoteClientPullVersionProgress = "remoteClient:PullVersionProgress"
// ETRemoteClientPullVersionCompleted indicates a version successfully pulled
// from a remote.
// payload will be a RemoteEvent
export const ETRemoteClientPullVersionCompleted = "remoteClient:PullVersionCompleted"
// ETRemoteClientPullDatasetCompleted indicates pulling a dataset
// (logbook + versions) completed
// payload will be a RemoteEvent
export const ETRemoteClientPullDatasetCompleted = "remoteClient:PullDatasetCompleted"
// ETRemoteClientRemoveDatasetCompleted indicates removing a dataset
// (logbook + versions) remove completed
// payload will be a RemoteEvent
export const ETRemoteClientRemoveDatasetCompleted = "remoteClient:RemoveDatasetCompleted"

// ETWorkflowStarted fires when a workflow has started running
// payload is a Workflow
export const ETWorkflowStarted = "wf:Started"
// ETWorkflowCompleted fires when a workflow has finished running
// payload is a Workflow
export const ETWorkflowCompleted = "wf:Completed"

// ETTransformStart signals the start of a transform execution
// payload is a TransformLifecycle
export const ETTransformStart = "tf:Start"
// ETTransformCanceled signals that the transform was canceled before it
// could fully execute
// payload is a TransformLifecycle
export const ETTransformCancel = "tf:Canceled"

// ETLogbookWriteRun occurs when the logbook writes an op of model
// `RunModel`, indicating that a new run of a dataset has occured
// payload is a dsref.VersionInfo
export const ETLogbookWriteRun = "logbook:WriteRun"
// ETLogbookWriteCommit occurs when the logbook writes an op of model
// `CommitModel`, indicating that a new dataset version has been saved
// payload is a dsref.VersionInfo
export const ETLogbookWriteCommit = "logbook:WriteCommit"

export const ETAutomationDeployStart = "automation:DeployStart"
export const ETAutomationDeployEnd = "automation:DeployEnd"

export const ETAutomationDeploySaveWorkflowStart = "automation:DeploySaveWorkflowStart"
export const ETAutomationDeploySaveWorkflowEnd = "automation:DeploySaveWorkflowEnd"

export const ETAutomationDeploySaveDatasetStart = "automation:DeploySaveDatasetStart"
export const ETAutomationDeploySaveDatasetEnd = "automation:DeploySaveDatasetEnd"

// Websocket message types describe the different types of messages that can be
// sent over the websocket connection to establish the authentication handshake
export const WSSubscribeRequest = "subscribe:request"
export const WSSubscribeSuccess = "subscribe:success"
export const WSSubscribeFailure = "subscribe:failure"
export const WSUnsubscribeRequest = "unsubscribe:request"

export interface TransformLifecycle {
  runID: string
  stepCount: number
  status: string
  mode: string
  initID: string
}

export function NewTransformLifecycle (data: Record<string, any>): TransformLifecycle {
  return {
    runID: data.runID,
    stepCount: data.stepCount,
    status: data.status,
    mode: data.mode,
    initID: data.initID
  }
}
