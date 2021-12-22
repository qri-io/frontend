import { createReducer } from '@reduxjs/toolkit'
import { RootState } from '../../../store/store'

export const RUN_QUEUE_ADD = 'RUN_QUEUE_ADD'
export const RUN_QUEUE_REMOVE = 'RUN_QUEUE_REMOVE'

export const selectRunIDFromQueue = (state: RootState, initID: string): string => {
  return state.runQueue.runs[initID] || ''
}

export interface RunQueueState {
  // runs is a map of initIDs to runIDs
  // of runs that are queued to run
  runs: Record<string, string>
}

const initialState: RunQueueState = {
  runs: {}
}

export const runQueueReducer = createReducer(initialState, {
  RUN_QUEUE_ADD: (state, action) => {
    state.runs[action.initID] = action.runID
  },
  RUN_QUEUE_REMOVE: (state, action) => {
    delete state.runs[action.initID]
  },
  'API_CANCEL_SUCCESS': (state, action) => {
    const initID = Object.keys(state.runs).find(initID => state.runs[initID] === action.runID)
    if (initID) {
      delete state.runs[initID]
    }
  }
})
