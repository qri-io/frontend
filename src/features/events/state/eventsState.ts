import { createReducer } from '@reduxjs/toolkit'

import { EventLogLine } from "../../../qri/eventLog"
import { NewRunFromEventLog, Run } from "../../../qri/run"
import { RootState } from "../../../store/store"
import {
  AddWaitingEventAction,
  EventLogAction,
  RemoveEventAction
} from "./eventsActions"

export const RUN_EVENT_LOG = 'RUN_EVENT_LOG'
export const REMOVE_EVENT = 'REMOVE_EVENT'
export const RUN_EVENT_ADD_WAITING = 'RUN_EVENT_ADD_WAITING'

export const selectRuns = (state: RootState): Run[] => {
  const { events } = state.events
  const { runId } = state.deploy
  const unique = Array.from(new Set(events.map(d => d.sessionID))).filter(id => id !== runId)

  return unique.map((d) => {
    return NewRunFromEventLog(d, events.filter(e => e.data.mode !== 'apply'))
  })
}

export const selectRun = (sessionId: string): (state: RootState) => Run =>
  (state: RootState) => NewRunFromEventLog(sessionId, state.events.events)

export const selectWaitingEventId = (state: RootState): string => state.events.waitingEventId

export interface EventsState {
  events: EventLogLine[]
  waitingEventId: string
}

const initialState: EventsState = {
  events: [],
  waitingEventId: ''
}

export const eventsReducer = createReducer(initialState, {
  RUN_EVENT_LOG: addRunEvent,
  RUN_EVENT_ADD_WAITING: addWaitingRunEvent,
  REMOVE_EVENT: removeEvent
})

function addWaitingRunEvent (state: EventsState, action: AddWaitingEventAction) {
  state.events.push(action.data)
  state.waitingEventId = action.id
}

function addRunEvent (state: EventsState, action: EventLogAction) {
  state.events = state.events.filter(e => e.type !== 'tf:Waiting')
  state.events.push(action.data)
  state.events.sort((a, b) => a.ts - b.ts)
}

function removeEvent (state: EventsState, action: RemoveEventAction) {
  state.events = state.events.filter(e => e.sessionID !== action.sessionID)
}
