import { Dispatch, AnyAction, Store } from 'redux'

import { QriRef } from '../../../qri/ref'
import { NewEventLogLine } from '../../../qri/eventLog'
import { RootState } from '../../../store/store'
import { trackVersionTransfer, completeVersionTransfer, removeVersionTransfer } from '../../transfer/state/transferActions'
import { runEventLog } from '../../events/state/eventsActions'
import { logbookWriteCommitEvent, logbookWriteRunEvent, transformStartEvent, transformCanceledEvent } from '../../collection/state/collectionActions'
import {
  deployStarted,
  deployEnded,
  deploySaveWorkflowStarted,
  deploySaveWorkflowEnded,
  deploySaveDatasetStarted,
  deploySaveDatasetEnded
} from '../../deploy/state/deployActions'
import {
  ETCreatedNewFile,
  ETModifiedFile,
  ETDeletedFile,
  ETRemoteClientPushVersionProgress,
  ETRemoteClientPushVersionCompleted,
  // ETRemoteClientPushDatasetCompleted,
  ETRemoteClientPullVersionProgress,
  ETRemoteClientPullVersionCompleted,
  // ETRemoteClientPullDatasetCompleted,
  ETRemoteClientRemoveDatasetCompleted,
  ETAutomationDeployStart,
  ETAutomationDeployEnd,
  ETAutomationDeploySaveDatasetStart,
  ETAutomationDeploySaveDatasetEnd,
  ETAutomationDeploySaveWorkflowStart,
  ETAutomationDeploySaveWorkflowEnd,
  ETAutomationRunQueuePush,
  ETAutomationRunQueuePop,
  ETTransformStart,
  WSSubscribeRequest,
  WSUnsubscribeRequest,
  ETLogbookWriteRun,
  ETLogbookWriteCommit,
  NewTransformLifecycle,
  ETTransformCancel
} from '../../../qri/events'
import { wsConnectionChange } from '../state/websocketActions'
import { WS_CONNECT, WS_DISCONNECT, WebsocketState, NewWebsocketState, WSConnectionStatus } from '../state/websocketState'

import { newVersionInfo } from '../../../qri/versionInfo'

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

const WEBSOCKETS_URL = process.env.REACT_APP_WS_BASE_URL || 'ws://localhost:2503'
const WEBSOCKETS_PROTOCOL = 'qri-websocket'
const numReconnectAttempts: number = 2
const msToAddBeforeReconnectAttempt: number = 3000

function newReconnectDeadline (): Date {
  let d = new Date()
  d.setSeconds(d.getSeconds() + msToAddBeforeReconnectAttempt)
  return d
}

const middleware = () => {
  let socket: WebSocket | undefined
  let state: WebsocketState = {
    status: WSConnectionStatus.disconnected
  }

  const onOpen = (dispatch: Dispatch, token: string) => (event: Event) => {
    state = {
      status: WSConnectionStatus.connected,
      reconnectAttemptsRemaining: 0,
      reconnectTime: undefined
    }
    const stateCopy = NewWebsocketState(state.status)
    dispatch(wsConnectionChange(stateCopy))
    subscribe(token)
  }

  const onClose = (dispatch: Dispatch, token: string) => (event: Event) => {
    // code 1006 is an "Abnormal Closure" where no close frame is sent. Happens
    // when there isn't a websocket host on the other end (aka: server down)
    // https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
    if ((event as any).code === 1006) {
      // connection failed
      // TODO (b5): here we're re-setting the number of connection attempts to a
      // number greater than zero on every failed connection, resulting in a
      // never-ending loop of re-connect attempts every x milliseconds.
      // We should be letting this value drop to zero, and providing the user
      // with a "retry" button when
      // (reconnectAttemptsRemaning === 0 && WSConnectionStatus === interuupted)
      state.reconnectAttemptsRemaining = numReconnectAttempts
    }

    reconnect(dispatch, token)
    const stateCopy = NewWebsocketState(state.status, state.reconnectAttemptsRemaining, state.reconnectTime)
    dispatch(wsConnectionChange(stateCopy))
  }

  const onMessage = (dispatch: Dispatch) => (e: MessageEvent) => {
    try {
      const event = JSON.parse(e.data)
      if (event.type.startsWith("tf:")) {
        if (event.type === ETTransformStart) dispatch(transformStartEvent(NewTransformLifecycle(event.data)))
        if (event.type === ETTransformCancel) dispatch(transformCanceledEvent(NewTransformLifecycle(event.data)))
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
        case ETAutomationDeployStart:
          dispatch(deployStarted(event.data, event.sessionID))
          break
        case ETAutomationDeployEnd:
          dispatch(deployEnded(event.data, event.sessionID))
          break
        case ETAutomationDeploySaveWorkflowStart:
          dispatch(deploySaveWorkflowStarted(event.data, event.sessionID))
          break
        case ETAutomationDeploySaveWorkflowEnd:
          dispatch(deploySaveWorkflowEnded(event.data, event.sessionID))
          break
        case ETAutomationDeploySaveDatasetStart:
          dispatch(deploySaveDatasetStarted(event.data, event.sessionID))
          break
        case ETAutomationRunQueuePush:
          dispatch(runQueuePush(event.sessionID, event.data))
          break
        case ETAutomationRunQueuePop:
          dispatch(runQueuePop(event.sessionID, event.data))
          break
        case ETAutomationDeploySaveDatasetEnd:
          dispatch(deploySaveDatasetEnded(event.data, event.sessionID))
          break
        case ETLogbookWriteCommit:
          dispatch(logbookWriteCommitEvent(newVersionInfo(event.data)))
          break
        case ETLogbookWriteRun:
          dispatch(logbookWriteRunEvent(newVersionInfo(event.data)))
          break
        default:
          // console.log(`received websocket event: ${event.type}`)
      }
    } catch (e) {
      // TODO(b5): handle this error!
      console.log(`error parsing websocket message: ${e}`)
    }
  }

  const connect = (dispatch: Dispatch, token: string) => {
    if (socket !== undefined) {
      socket.close()
    }
    // connect to the remote host
    socket = new WebSocket(WEBSOCKETS_URL, WEBSOCKETS_PROTOCOL)
    socket.onmessage = onMessage(dispatch)
    socket.onclose = onClose(dispatch, token)
    socket.onopen = onOpen(dispatch, token)
  }

  const subscribe = (token: string) => {
    if (token === "") {
      return
    }
    if (socket === undefined) {
      return
    }
    let reconnectAttemptsRemaining = numReconnectAttempts
    const msg = JSON.stringify({ type: WSSubscribeRequest, payload: { token } })
    const attempt = setInterval(() => {
      if (reconnectAttemptsRemaining === 0) {
        clearInterval(attempt)
      }
      if (socket?.readyState === 1) {
        socket.send(msg)
        clearInterval(attempt)
        return
      }
      reconnectAttemptsRemaining--
    }, msToAddBeforeReconnectAttempt)
  }

  const unsubscribe = () => {
    if (socket === undefined) {
      return
    }
    let reconnectAttemptsRemaining = numReconnectAttempts
    const attempt = setInterval(() => {
      if (reconnectAttemptsRemaining === 0) {
        clearInterval(attempt)
      }
      if (socket?.readyState === 1) {
        socket.send(JSON.stringify({ type: WSUnsubscribeRequest }))
        clearInterval(attempt)
        return
      }
      reconnectAttemptsRemaining--
    }, msToAddBeforeReconnectAttempt)
  }

  const reconnect = (dispatch: Dispatch, token: string) => {
    if (state.reconnectAttemptsRemaining && state.reconnectAttemptsRemaining > 0) {
      state = {
        status: WSConnectionStatus.interrupted,
        reconnectAttemptsRemaining: state.reconnectAttemptsRemaining - 1,
        reconnectTime: newReconnectDeadline()
      }
      setTimeout(() => {
        connect(dispatch, token)
      }, msToAddBeforeReconnectAttempt)
      return
    }

    // no reconnect attempts remaining, we're just disconnected
    state = {
      status: WSConnectionStatus.disconnected
    }
  }

  // middleware
  return (store: Store<RootState>) => (next: Dispatch<AnyAction>) => (action: AnyAction) => {
    switch (action.type) {
      case WS_CONNECT:
        connect(next, action.token)
        break
      case WS_DISCONNECT:
        if (socket !== undefined) {
          socket.close()
        }
        socket = undefined
        break
      case 'LOGIN_SUCCESS':
        subscribe(action.token)
        break
      case 'LOGOUT_SUCCESS':
        unsubscribe()
    }

    return next(action)
  }
}

export const websocketMiddleware = middleware()
