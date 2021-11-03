import { createReducer } from '@reduxjs/toolkit'

import { EventLogLine } from "../../../qri/eventLog"
import { NewRunFromEventLog, Run } from "../../../qri/run"
import { RootState } from "../../../store/store"
import { EventLogAction, RemoveEventAction } from "./eventsActions"

export const RUN_EVENT_LOG = 'RUN_EVENT_LOG'
export const REMOVE_EVENT = 'REMOVE_EVENT'

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

export interface EventsState {
  events: EventLogLine[]
}

const initialState: EventsState = {
  events: []
}

export const eventsReducer = createReducer(initialState, {
  RUN_EVENT_LOG: addRunEvent,
  REMOVE_EVENT: removeEvent
})

function addRunEvent (state: EventsState, action: EventLogAction) {
  state.events.push(action.data)
  state.events.sort((a, b) => a.ts - b.ts)
}

function removeEvent (state: EventsState, action: RemoveEventAction) {
  state.events = state.events.filter(e => e.sessionID !== action.sessionID)
}
