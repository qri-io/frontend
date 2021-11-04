import { createReducer } from '@reduxjs/toolkit'

import { RootState } from '../../../store/store'
import { WebsocketAction } from './websocketActions'

export const WS_CONNECT = 'WS_CONNECT'
export const WS_DISCONNECT = 'WS_DISCONNECT'
export const WS_CONNECTION_CHANGE = 'WS_CONNECTION_CHANGE'

export const selectWebsocketState = (state: RootState): WebsocketState => state.websocket

export enum WSConnectionStatus {
  disconnected, // no connection
  connecting, // constructing connection
  connected, // OK
  interrupted, // disconnected, but want a connection
}

export interface WebsocketState {
  status: WSConnectionStatus
  reconnectTime?: Date // when disconnected, the time to wait until reconnecting
  reconnectAttemptsRemaining?: number
}

export function NewWebsocketState (status: WSConnectionStatus, reconnectAttemptsRemaining?: number, reconnectTime?: Date): WebsocketState {
  return {
    status,
    reconnectTime,
    reconnectAttemptsRemaining: reconnectAttemptsRemaining || 0
  }
}

const initialState: WebsocketState = {
  status: WSConnectionStatus.disconnected,
  reconnectAttemptsRemaining: 0
}

export const websocketReducer = createReducer(initialState, {
  WS_CONNECTION_CHANGE: (state: WebsocketState, action: WebsocketAction) => {
    state.status = action.wsState.status
    state.reconnectTime = action.wsState.reconnectTime
    state.reconnectAttemptsRemaining = action.wsState.reconnectAttemptsRemaining
  }
})
