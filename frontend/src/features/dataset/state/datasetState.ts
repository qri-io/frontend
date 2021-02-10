import { RootState } from '../../../store/store';
import { createReducer } from '@reduxjs/toolkit'
import Dataset, { NewDataset } from '../../../qri/dataset';

export const selectDataset = (state: RootState): Dataset => state.dataset.dataset

export interface DatasetState {
  dataset: Dataset
}

const initialState: DatasetState = {
  dataset: NewDataset({})
}

export const datasetReducer = createReducer(initialState, {
  'API_DATASET_SUCCESS': (state, action) => {
    state.dataset = action.payload.data as Dataset
  },
  'API_BODY_SUCCESS': (state, action) => {
    state.dataset.body = action.payload.data as Body
  }
})