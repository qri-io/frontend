import { EventLogLine } from "../../../qri/eventLog"

import {
  REMOVE_EVENT,
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
