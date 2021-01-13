import { RootState } from '../../../store/store';
import { createReducer } from '@reduxjs/toolkit'
import Dataset, { newDataset } from '../../../qri/dataset';

export const selectDataset = (state: RootState): Dataset => state.dataset.dataset

export interface DatasetState {
  dataset: Dataset,
}

const initialState: DatasetState = {
  dataset: newDataset({}),
}

export const datasetReducer = createReducer(initialState, {
  'API_DATASET_SUCCESS': (state, action) => {
    console.log('fetched dataset', action)
    state.dataset = action.payload.data as Dataset
  },
})