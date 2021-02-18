import { RootState } from '../../../store/store';
import { createReducer } from '@reduxjs/toolkit'
import { WorkflowInfo } from '../../../qrimatic/workflow';


export const selectCollection = (state: RootState): WorkflowInfo[] => state.collection.datasets
export const selectIsCollectionLoading = (state: RootState): boolean => state.collection.loading

export interface CollectionState {
  datasets: WorkflowInfo[],
  loading: boolean
}

const initialState: CollectionState = {
  datasets: [],
  loading: true
}

export const collectionReducer = createReducer(initialState, {
  'API_COLLECTION_SUCCESS': (state, action) => {
    state.datasets = action.payload.data as WorkflowInfo[]
    state.loading = false
  },
  'API_COLLECTION_FAILURE': (state, action) => {
    state.loading = false
  }
})