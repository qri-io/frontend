
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