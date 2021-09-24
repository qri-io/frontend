import { Action } from "redux";
import {
  WS_CONNECT,
  WS_DISCONNECT,
  WS_CONNECTION_CHANGE,
  WebsocketState,
} from './websocketState'

interface ConnectAction extends Action {
  token: string
}

// tell websocket to connect
export function wsConnect(token?: string): ConnectAction {
  return { type: WS_CONNECT, token: token || '' }
}

// tell websocket to disconnect
export function wsDisconnect(): Action {
  return { type: WS_DISCONNECT }
}

// WebsocketAction broadcasts connection state changes. connection state is 
// owned by websocket middlware
export interface WebsocketAction extends Action {
  wsState: WebsocketState
}

// wsConnectionChange actions must only be dispatched by websocket middleware
export function wsConnectionChange(wsState: WebsocketState): WebsocketAction {
  return {
    type: WS_CONNECTION_CHANGE,
    wsState,
  }
}