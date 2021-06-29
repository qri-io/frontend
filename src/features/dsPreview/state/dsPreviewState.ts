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
  'DS_PREVIEW_REQUEST': (state) => {
    state.preview = undefined
    state.loading = true
  },
  'DS_PREVIEW_SUCCESS': (state) => {
    state.loading = false
  },
  'DS_PREVIEW_FAILURE': (state) => {
    state.loading = false
  },


  'API_PREVIEW_FAILURE': (state) => {
    state.loading = false
  },
  'API_PREVIEW_SUCCESS': (state, action) => {
    state.preview = action.payload.data
  },

  'API_PREVIEWBODY_REQUEST': (state) => {
    state.loading = true
  },
  'API_PREVIEWBODY_SUCCESS': (state, action) => {
    state.preview.body = action.payload.data
  },

  'API_PREVIEWREADME_SUCCESS': (state, action) => {
    state.preview.readme = { script: atob(action.payload.data) }
  },
  'API_PREVIEWREADME_FAILURE': (state, action) => {
  },
})
