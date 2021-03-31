import { createReducer } from '@reduxjs/toolkit'

import { RootState } from '../../../store/store';
import Dataset, { NewDataset } from '../../../qri/dataset';
import { EditDatasetAction } from './editDatasetActions';

export const EDIT_DATASET = 'EDIT_DATASET'

export const selectDatasetEdits = (state: RootState): Dataset => state.edits.dataset

export const selectEditingHeadIsLoading = (state: RootState): boolean => state.edits.loading

export interface DatasetEditsState {
  dataset: Dataset
  hasEdits: boolean
  // latest version
  head?: Dataset
  loading: boolean
}

const initialState: DatasetEditsState = {
  dataset: NewDataset({}),
  hasEdits: false,
  loading: false
}

export const datasetEditsReducer = createReducer(initialState, {
  'EDIT_DATASET': (state: DatasetEditsState, action: EditDatasetAction) => {
    let field = action.ref.selector?.slice(0,-1).reduce((acc, f) => {
      if (!acc[f]) {
        throw(new Error(`bad selector: ${action.ref.selector?.join('/')}. ${f} does not exist`))
      }
      return acc[f]
    }, state.dataset as Record<string,any>)

    if (field && action.ref.selector?.length) {
      field[action.ref.selector[action.ref.selector.length-1]] = action.value
    }
    state.hasEdits = true
  },
  'API_EDITING_DATASET_HEAD_REQUEST': (state) => {
    state.loading = true
  },
  'API_EDITING_DATASET_HEAD_SUCCESS': (state, action) => {
    state.head = action.payload.data as Dataset
    state.dataset = action.payload.data
    state.dataset.commit = undefined
    state.loading = false
    state.hasEdits = false
  },
  'API_EDITING_DATASET_HEAD_FAILURE': (state) => {
    state.loading = false
  }
})