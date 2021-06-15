import { createReducer } from '@reduxjs/toolkit'

import { RootState } from '../../../store/store';
import { humanRef, QriRef, refStringFromQriRef } from '../../../qri/ref';
import { LogItem } from '../../../qri/log';

export function newDatasetCommitsSelector(qriRef: QriRef): (state: RootState) => LogItem[] {
  qriRef = humanRef(qriRef)
  return (state: RootState) => {
    return state.commits.commits[refStringFromQriRef(qriRef)] || []
  }
}

export function selectDatasetCommitsLoading(state: RootState): boolean {
  return state.commits.loading
}

export interface CommitsState {
  commits: Record<string,LogItem[]>
  loading: boolean
  loadError: string
}

const initialState: CommitsState = {
  commits: {},
  loading: false,
  loadError: ''
}

export const commitsReducer = createReducer(initialState, {
  'API_DATASET_COMMITS_REQUEST': (state, action) => {
    state.loading = true
  },
  'API_DATASET_COMMITS_FAILURE': (state, action) => {
    state.loading = false
    // TODO (b5): capture error from API response
    state.loadError = 'failed to load commits'
  },
  'API_DATASET_COMMITS_SUCCESS': (state, action) => {
    const ls = action.payload.data as LogItem[]
    state.commits[refStringFromQriRef(action.qriRef)] = ls
    state.loading = false
  },
})