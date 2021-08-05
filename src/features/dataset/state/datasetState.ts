import { createReducer } from '@reduxjs/toolkit'

import { RootState } from '../../../store/store';
import Dataset, { NewDataset } from '../../../qri/dataset';
import { qriRefFromString } from '../../../qri/ref';
import { RenameDatasetAction } from './datasetActions';
import { selectSessionUser } from '../../session/state/sessionState';

export const RENAME_NEW_DATASET = 'RENAME_NEW_DATASET'

export const selectDataset = (state: RootState): Dataset => state.dataset.version.dataset

export const selectIsDatasetLoading = (state: RootState): boolean => state.dataset.version.loading

export const selectSessionUserCanEditDataset = (state: RootState): boolean => {
  const u = selectSessionUser(state)
  if (state.dataset.head.loading) {
    return false
  }
  // TODO(b5) - this would ideally be checking for an existing dataset ID instead
  // of a path
  if (state.dataset.head.dataset.path === '') {
    return true
  }
  return u.username === state.dataset.head.dataset.peername
}

export const selectDatasetHead = (state: RootState): Dataset => state.dataset.head.dataset
export const selectIsDsPreviewLoading = (state: RootState): boolean => state.dataset.head.loading

export interface DatasetState {
  head: {
    dataset: Dataset
    loading: boolean
  }
  version: {
    dataset: Dataset
    loading: boolean
  }
}

const initialState: DatasetState = {
  head: {
    dataset: NewDataset({}),
    loading: true
  },
  version: {
    dataset: NewDataset({}),
    loading: true
  }
}

export const datasetReducer = createReducer(initialState, {
  'API_DATASETHEAD_REQUEST': (state) => {
    state.head.dataset = NewDataset({})
    state.head.loading = true
  },

  'API_DATASETHEAD_SUCCESS': (state, action) => {
    console.log(action.payload.data)
    state.head.dataset = {
      ...state.head,
      ...action.payload.data
    }
    state.head.loading = false
  },

  'API_DATASETHEAD_FAILURE': (state) => {
    state.head.loading = false
  },

  'API_DATASETHEADBODY_REQUEST': (state) => {
    state.head.loading = true
  },
  'API_DATASETHEADBODY_SUCCESS': (state, action) => {
    state.head.dataset.body = action.payload.data
    state.head.loading = false
  },
  'API_DATASETHEADBODY_FAILURE': (state, action) => {
    state.head.loading = false
  },

  'API_DATASETHEADREADME_REQUEST': (state, action) => {
    state.head.loading = true
  },
  'API_DATASETHEADREADME_SUCCESS': (state, action) => {
    state.head.dataset.readme = { script: atob(action.payload.data) }
    state.head.loading = false
  },
  'API_DATASETHEADREADME_FAILURE': (state, action) => {
    state.head.loading = false
  },


  'API_DATASET_REQUEST': (state) => {
    state.version.dataset = NewDataset({})
    state.version.loading = true
  },
  'API_DATASET_SUCCESS': (state, action) => {
    state.version.dataset = action.payload.data as Dataset
    state.version.loading = false
  },
  'API_DATASET_FAILURE': (state) => {
    state.version.loading = false
  },
  'API_BODY_SUCCESS': (state, action) => {
    state.version.dataset.body = action.payload.data as Body
  },
  'API_REMOVE_SUCCESS': (state, action) => {
    const ref = qriRefFromString(action.payload.data.Ref)
    if (state.version.dataset.peername === ref.username && state.version.dataset.name === ref.name) {
      state.version.dataset = NewDataset({})
    }
  },
  'API_RENAME_SUCCESS': (state, action) => {
    // TODO(b5): finish
  },
  RENAME_NEW_DATASET: (state: DatasetState, action: RenameDatasetAction) => {
    state.version.dataset.name = action.next.name
  }
})
