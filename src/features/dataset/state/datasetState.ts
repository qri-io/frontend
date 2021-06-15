import { createReducer } from '@reduxjs/toolkit'

import { RootState } from '../../../store/store';
import Dataset, { NewDataset } from '../../../qri/dataset';
import { qriRefFromString } from '../../../qri/ref';
import { RenameDatasetAction } from './datasetActions';
import { selectSessionUser } from '../../session/state/sessionState';

export const RENAME_NEW_DATASET = 'RENAME_NEW_DATASET'

export const selectDataset = (state: RootState): Dataset => state.dataset.dataset

export const selectIsDatasetLoading = (state: RootState): boolean => state.dataset.loading

export const selectSessionUserCanEditDataset = (state: RootState): boolean => {
  const u = selectSessionUser(state)
  if (state.dataset.loading) {
    return false
  }
  // TODO(b5) - this would ideally be checking for an existing dataset ID instead
  // of a path
  if (state.dataset.dataset.path === '') {
    return true
  }
  return u.username === state.dataset.dataset.peername
}

export interface DatasetState {
  dataset: Dataset
  loading: boolean
}

const initialState: DatasetState = {
  dataset: NewDataset({}),
  loading: true
}

export const datasetReducer = createReducer(initialState, {
  'API_DATASET_REQUEST': (state) => {
    state.dataset = NewDataset({})
    state.loading = true
  },
  'API_DATASET_SUCCESS': (state, action) => {
    state.dataset = action.payload.data as Dataset
    state.loading = false
  },
  'API_DATASET_FAILURE': (state) => {
    state.loading = false
  },
  'API_BODY_SUCCESS': (state, action) => {
    state.dataset.body = action.payload.data as Body
  },
  'API_REMOVE_SUCCESS': (state, action) => {
    const ref = qriRefFromString(action.payload.data.Ref)
    if (state.dataset.peername === ref.username && state.dataset.name === ref.name) {
      state.dataset = NewDataset({})
    }
  },
  'API_RENAME_SUCCESS': (state, action) => {
    // TODO(b5): finish
  },
  RENAME_NEW_DATASET: (state: DatasetState, action: RenameDatasetAction) => {
    state.dataset.name = action.next.name
  }
})