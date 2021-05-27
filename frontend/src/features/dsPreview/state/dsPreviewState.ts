import { createReducer } from '@reduxjs/toolkit'

import { RootState } from '../../../store/store';

export const selectDsPreview = (state: RootState): any => state.dsPreview.preview

export const selectIsDsPreviewLoading = (state: RootState): boolean => state.dsPreview.loading

export interface DsPreviewState {
  preview: any
  loading: boolean
}

const initialState: DsPreviewState = {
  preview: {},
  loading: true
}

export const dsPreviewReducer = createReducer(initialState, {
  'API_DATASETPREVIEW_REQUEST': (state) => {
    state.preview = {}
    state.loading = true
  },
  'API_DATASETPREVIEW_SUCCESS': (state, action) => {
    state.preview = action.payload.data
    state.loading = false
  },
  'API_DATASETPREVIEW_FAILURE': (state) => {
    state.preview = false
  }
})
