import { EventLogLine, EventLogLineType } from "../../../qri/eventLog"

import {
  REMOVE_EVENT, RUN_EVENT_ADD_WAITING,
  RUN_EVENT_LOG
} from "./eventsState"

export interface EventLogAction {
  type: string
  data: EventLogLine
}

export interface RemoveEventAction {
  type: string
  sessionID: string
}

export interface AddWaitingEventAction extends EventLogAction{
  id: string
}

export function addWaitingEvent (id: string): AddWaitingEventAction {
  const data: EventLogLine = {
    type: EventLogLineType.ETTransformWaiting,
    ts: 0,
    sessionID: id,
    data: { status: 'waiting', id }
  }
  return {
    type: RUN_EVENT_ADD_WAITING,
    data: data,
    id
  }
}

export function runEventLog (event: EventLogLine): EventLogAction {
  return {
    type: RUN_EVENT_LOG,
    data: event
  }
}

export function removeEvent (sessionID: string): RemoveEventAction {
  return {
    type: REMOVE_EVENT,
    sessionID: sessionID
  }
}
