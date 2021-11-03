import { createReducer } from '@reduxjs/toolkit'

import { RootState } from '../../../store/store'
import { humanRef, QriRef, refStringFromQriRef } from '../../../qri/ref'
import { LogItem } from '../../../qri/log'
import { ApiErr, NewApiErr } from '../../../store/api'

export function newDatasetCommitsSelector (qriRef: QriRef): (state: RootState) => LogItem[] {
  qriRef = humanRef(qriRef)
  return (state: RootState) => {
    return state.commits.commits[refStringFromQriRef(qriRef)] || []
  }
}

export function selectVersionCount (qriRef: QriRef): (state: RootState) => number {
  qriRef = humanRef(qriRef)
  return (state: RootState) => {
    return state.commits.commits[refStringFromQriRef(qriRef)]?.length
  }
}

export function selectDatasetCommitsLoading (state: RootState): boolean {
  return state.commits.loading
}

export interface CommitsState {
  commits: Record<string, LogItem[]>
  loading: boolean
  error: ApiErr
}

const initialState: CommitsState = {
  commits: {},
  loading: false,
  error: NewApiErr()
}

export const commitsReducer = createReducer(initialState, {
  'API_DATASET_ACTIVITY_HISTORY_REQUEST': (state, action) => {
    state.loading = true
  },
  'API_DATASET_ACTIVITY_HISTORY_FAILURE': (state, action) => {
    state.loading = false
    state.error = action.payload.err
  },
  'API_DATASET_ACTIVITY_HISTORY_SUCCESS': (state, action) => {
    state.commits[refStringFromQriRef(action.qriRef)] = action.payload.data
    state.loading = false
  }
})
