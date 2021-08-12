import { createReducer } from '@reduxjs/toolkit'

import { RootState } from '../../../store/store';
import { QriRef, humanRef, refStringFromQriRef } from '../../../qri/ref';
import { LogItem } from '../../../qri/log';

export function newDatasetLogsSelector(qriRef: QriRef): (state: RootState) => LogItem[] {
  return (state: RootState) => {
    return state.activityFeed.datasetLogs[refStringFromQriRef(qriRef)] || []
  }
}

export function selectLogCount(qriRef: QriRef): (state: RootState) => number {
  qriRef = humanRef(qriRef)
  return (state: RootState) => {
    return state.activityFeed.datasetLogs[refStringFromQriRef(qriRef)]?.length
  }
}

export interface ActivityFeedState {
  datasetLogs: Record<string,LogItem[]>
}

const initialState: ActivityFeedState = {
  datasetLogs: {}
}

export const activityFeedReducer = createReducer(initialState, {
  'API_DATASET_ACTIVITY_SUCCESS': (state, action) => {
    const ls = action.payload.data as LogItem[]
    state.datasetLogs[refStringFromQriRef(action.qriRef)] = ls
  },
})
