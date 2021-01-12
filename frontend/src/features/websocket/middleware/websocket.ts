import { Dispatch, AnyAction, Store } from 'redux'

import { QriRef } from '../../../qri/ref'
import { NewEventLogLine } from '../../../qrimatic/eventLog'
import { RootState } from '../../../store/store'
import { jobScheduled, jobUnscheduled, jobStarted, jobStopped } from '../../job/state/jobActions'
import { trackVersionTransfer, completeVersionTransfer, removeVersionTransfer } from '../../transfer/state/transferActions'
import { runEventLog } from '../../workflow/state/workflowActions'

type DagCompletion = number[]

type RemoteEventType =
  | 'push-version'
  | 'pull-version'

export interface RemoteEvent {
  ref: QriRef
  remoteAddr: string
  progress: DagCompletion
  type: RemoteEventType
  complete?: boolean
}

export type RemoteEvents = Record<string, RemoteEvent>

export const WEBSOCKETS_URL = 'ws://localhost:2506'
export const WEBSOCKETS_PROTOCOL = 'qri-websocket'

// wsMiddleware manages requests to connect to the qri backend via websockets
// as well as managing messages that get passed through
export const wsConnect = () => ({ type: 'WS_CONNECT' })
export const wsConnecting = () => ({ type: 'WS_CONNECTING' })
export const wsConnected = () => ({ type: 'WS_CONNECTED' })
export const wsDisconnect = () => ({ type: 'WS_DISCONNECT' })
export const wsDisconnected = () => ({ type: 'WS_DISCONNECTED' })


// ETCreatedNewFile is the event for creating a new file
const ETCreatedNewFile = "watchfs:CreatedNewFile"
// ETModifiedFile is the event for modifying a file
const ETModifiedFile = "watchfs:ModifiedFile"
// ETDeletedFile is the event for deleting a file
const ETDeletedFile = "watchfs:DeletedFile"
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

// ETCronJobStarted fires when a job has started running
// payload is a Job
// subscriptions do not block the publisher
const ETCronJobStarted = "cron:JobStarted"
// ETCronJobCompleted fires when a job has finished running
// payload is a Job
// subscriptions do not block the publisher
const ETCronJobCompleted = "cron:JobCompleted"
	// ETCronJobScheduled fires when a job is registered for updating, or when
	// a scheduled job changes
	// payload is a Job
	// subscriptions do not block the publisher
const	ETCronJobScheduled = "cron:JobScheduled"
	// ETCronJobUnscheduled fires when a job is removed from the update schedule
	// payload is a Job
	// subscriptions do not block the publisher
const ETCronJobUnscheduled = "cron:JobUnscheduled"

const middleware = () => {
  let socket: WebSocket | undefined
  console.log('constructing ws middleware')

  const onOpen = (dispatch: Dispatch ) => (event: Event) => {
    console.log('websocket opened')
    if (socket !== undefined) {
      return
    }
    // dispatch(wsConnect())
  }

  const onClose = (dispatch: Dispatch) => () => {
    console.log('websocket closed')
    dispatch(wsDisconnected())
  }

  const onMessage = (dispatch: Dispatch) => (e: MessageEvent) => {
    try {
      const event = JSON.parse(e.data)

      if (event.type.startsWith("transform:")) {
        dispatch(runEventLog(NewEventLogLine(event)))
        return
      }

      switch (event.type) {
        case ETCreatedNewFile:
        case ETModifiedFile:
        case ETDeletedFile:
          // const { workingDataset } = store.getState()
          // const { peername, name, status } = workingDataset
          // // if the websocket message Username and Dsname match the peername and
          // // dataset name of the dataset that is currently being viewed, fetch
          // // status
          // if (peername && name && peername === event.data.username && name === event.data.dsName && !workingDataset.isWriting && !workingDataset.isSaving) {
          //   const components = Object.keys(status)
          //   components.forEach((component: string) => {
          //     if (event.data.source === status[component].filepath) {
          //       const wsMtime = new Date(Date.parse(event.data.time))
          //       // if there is and mtime or if the ws mtime is older then the status mtime, don't refetch
          //       if (status[component].mtime && !(status[component].mtime < wsMtime)) return
          //       // if there is no mtime, or if the ws mtime is newer then the status mtime, fetch!
          //       fetchWorkingDatasetDetails(peername, name)(store.dispatch, store.getState)
          //       store.dispatch(resetMutationsDataset())
          //       store.dispatch(resetMutationsStatus())
          //     }
          //   })
          // }
          break
        case ETRemoteClientPushVersionProgress:
        case ETRemoteClientPullVersionProgress:
          event.data.type = event.type === ETRemoteClientPushVersionProgress ? "push-version" : "pull-version"
          dispatch(trackVersionTransfer(event.data))
          break
        // case ETRemoteClientPushDatasetCompleted:
        // case ETRemoteClientPullDatasetCompleted:
        case ETRemoteClientPushVersionCompleted:
        case ETRemoteClientPullVersionCompleted:
          event.data.type = event.type === ETRemoteClientPushVersionCompleted ? "push-version" : "pull-version"
          dispatch(completeVersionTransfer(event.data))
          break
        case ETRemoteClientRemoveDatasetCompleted:
          dispatch(removeVersionTransfer(event.data))
          break
        case ETCronJobScheduled:
          dispatch(jobScheduled(event.data))
          break
        case ETCronJobUnscheduled:
          dispatch(jobUnscheduled(event.data))
          break
        case ETCronJobStarted:
          dispatch(jobStarted(event.data))
          break
        case ETCronJobCompleted:
          dispatch(jobStopped(event.data))
          break
        default:
          // console.log(`received websocket event: ${event.type}`)
      }
    } catch (e) {
      console.log(`error parsing websocket message: ${e}`)
    }
  }

  // middleware
  return (store: Store<RootState>) => (next: Dispatch<AnyAction>) => (action: AnyAction) => {
    switch (action.type) {
      case 'WS_CONNECT':
        if (socket !== undefined) {
          socket.close()
        }
        console.log('connecting')
        // connect to the remote host
        socket = new WebSocket(WEBSOCKETS_URL, WEBSOCKETS_PROTOCOL)
        socket.onmessage = onMessage(next)
        socket.onclose = onClose(next)
        socket.onopen = onOpen(next)

        break
      case 'WS_DISCONNECT':
        if (socket !== undefined) {
          socket.close()
        }
        socket = undefined
        console.log('websocket closed')
        break
      default:
        return next(action)
    }
  }
}

export const websocketMiddleware = middleware()
