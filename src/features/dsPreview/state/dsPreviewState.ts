import { createReducer } from '@reduxjs/toolkit'

import { RootState } from '../../../store/store'
import { Dataset } from '../../../qri/dataset'

export const selectDsPreview = (state: RootState): any => state.dsPreview.preview

export const selectIsDsPreviewLoading = (state: RootState): boolean => state.dsPreview.loading

export interface DsPreviewState {
  preview?: Dataset
  loading: boolean
}

const initialState: DsPreviewState = {
  loading: false
}

export const dsPreviewReducer = createReducer(initialState, {
  'API_DATASETPREVIEW_REQUEST': (state) => {
    state.preview = undefined
    state.loading = true
  },
  'API_DATASETPREVIEW_SUCCESS': (state, action) => {
    state.preview = action.payload.data
    state.loading = false
  },
  'API_DATASETPREVIEW_FAILURE': (state) => {
    state.loading = false
  }
})
