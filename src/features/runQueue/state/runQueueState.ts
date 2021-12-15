import { createReducer } from '@reduxjs/toolkit'
import { RootState } from '../../../store/store'

export const RUN_QUEUE_PUSH = 'RUN_QUEUE_PUSH'
export const RUN_QUEUE_POP = 'RUN_QUEUE_POP'

export const selectQueuedRunID = (state: RootState, initID: string): string => {
  return state.runQueue.queued[initID] || ''
}
export interface RunQueueState {
  queued: Record<string, string>
}

const initialState: RunQueueState = {
  queued: {}
}

export const runQueueReducer = createReducer(initialState, {
  RUN_QUEUE_PUSH: (state, action) => {
    state.queued[action.initID] = action.runID
  },
  RUN_QUEUE_POP: (state, action) => {
    delete state.queued[action.initID]
  }
})
