import { RootState } from '../../../store/store';
import { createReducer } from '@reduxjs/toolkit'
import Dataset, { NewDataset } from '../../../qri/dataset';
import { qriRefFromString } from '../../../qri/ref';

export const selectDataset = (state: RootState): Dataset => state.dataset.dataset

export const selectIsDatasetLoading = (state: RootState): boolean => state.dataset.loading

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
  }
})