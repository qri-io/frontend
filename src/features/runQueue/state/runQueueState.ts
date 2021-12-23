import { createReducer } from '@reduxjs/toolkit'
import { RootState } from '../../../store/store'
import { RunQueueAction } from './runQueueActions'

export const RUN_QUEUE_ADD = 'RUN_QUEUE_ADD'
export const RUN_QUEUE_REMOVE = 'RUN_QUEUE_REMOVE'

export const selectIsRunQueued = (runID: string): (state: RootState) => boolean => (state) => state.runQueue.runs.includes(runID)

export interface RunQueueState {
  // runs is a list of runIDs whose runs are waiting to run
  runs: string[]
}

const initialState: RunQueueState = {
  runs: []
}

const runQueueAddToReducer = (state: RunQueueState, action: RunQueueAction) => {
  const indexOf = state.runs.indexOf(action.runID)
  if (indexOf === -1) {
    state.runs.push(action.runID)
  }
}

const runQueueRemoveFromReducer = (state: RunQueueState, action: RunQueueAction) => {
  state.runs = state.runs.filter(runID => runID !== action.runID)
}

export const runQueueReducer = createReducer(initialState, {
  RUN_QUEUE_ADD: runQueueAddToReducer,
  RUN_QUEUE_REMOVE: runQueueRemoveFromReducer,
  'API_CANCEL_SUCCESS': runQueueRemoveFromReducer
})
