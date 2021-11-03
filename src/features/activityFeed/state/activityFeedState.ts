import { createReducer } from '@reduxjs/toolkit'

import { RootState } from '../../../store/store'
import { QriRef, humanRef, refStringFromQriRef } from '../../../qri/ref'
import { LogItem } from '../../../qri/log'
import { ApiErr, NewApiErr } from '../../../store/api'

export function newDatasetLogsSelector (qriRef: QriRef): (state: RootState) => LogItem[] {
  return (state: RootState) => {
    return state.activityFeed.datasetLogs[refStringFromQriRef(qriRef)] || []
  }
}

export function selectLogCount (qriRef: QriRef): (state: RootState) => number {
  qriRef = humanRef(qriRef)
  return (state: RootState) => {
    return state.activityFeed.datasetLogs[refStringFromQriRef(qriRef)]?.length
  }
}

export interface ActivityFeedState {
  datasetLogs: Record<string, LogItem[]>
  loading: boolean
  error: ApiErr
}

const initialState: ActivityFeedState = {
  datasetLogs: {},
  loading: false,
  error: NewApiErr()
}

export const activityFeedReducer = createReducer(initialState, {
  'API_DATASET_ACTIVITY_RUNS_REQUEST': (state, action) => {
    state.loading = true
  },

  'API_DATASET_ACTIVITY_RUNS_SUCCESS': (state, action) => {
    state.loading = false
    state.datasetLogs[refStringFromQriRef(action.qriRef)] = action.payload.data
  },

  'API_DATASET_ACTIVITY_RUNS_FAILURE': (state, action) => {
    state.loading = false
    state.error = action.payload.err
  }
})
