import { createReducer } from '@reduxjs/toolkit'

import { RootState } from '../../../store/store';
import { QriRef, refStringFromQriRef } from '../../../qri/ref';
import { LogItem } from '../../../qri/log';

export function newDatasetLogsSelector(qriRef: QriRef): (state: RootState) => LogItem[] {
  return (state: RootState) => {
    return state.activityFeed.datasetLogs[refStringFromQriRef(qriRef)] || []
  }
}

export interface ActivityFeedState {
  datasetLogs: Record<string,LogItem[]>
}

const initialState: ActivityFeedState = {
  datasetLogs: {}
}

export const activityFeedReducer = createReducer(initialState, {
  'API_DATASET_LOGS_SUCCESS': (state, action) => {
    const ls = action.payload.data as LogItem[]
    state.datasetLogs[refStringFromQriRef(action.qriRef)] = ls
  },
})