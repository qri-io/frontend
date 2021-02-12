import { RootState } from '../../../store/store';
import { createReducer } from '@reduxjs/toolkit'
import { VersionInfo } from '../../../qri/versionInfo';


export const selectCollection = (state: RootState): VersionInfo[] => state.collection.datasets
export const selectIsCollectionLoading = (state: RootState): boolean => state.collection.loading

export interface CollectionState {
  datasets: VersionInfo[],
  loading: boolean
}

const initialState: CollectionState = {
  datasets: [],
  loading: true
}

export const collectionReducer = createReducer(initialState, {
  'API_LIST_SUCCESS': (state, action) => {
    state.datasets = action.payload.data as VersionInfo[]
    state.loading = false
  },
  'API_LIST_FAILURE': (state, action) => {
    state.loading = false
  }
})