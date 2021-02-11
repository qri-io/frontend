import { RootState } from '../../../store/store';
import { createReducer } from '@reduxjs/toolkit'
import { VersionInfo } from '../../../qri/versionInfo';


export const selectCollection = (state: RootState): VersionInfo[] => state.collection.datasets

export interface CollectionState {
  datasets: VersionInfo[],
}

const initialState: CollectionState = {
  datasets: [],
}

export const collectionReducer = createReducer(initialState, {
  'API_LIST_SUCCESS': (state, action) => {
    state.datasets = action.payload.data as VersionInfo[]
  },
})