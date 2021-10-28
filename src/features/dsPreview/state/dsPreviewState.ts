// we are currently using dsPreview as the place to store top-level info for the
// active dataset (the dataset the user is using a /ds route for)
// it is used to populate the header info, to store whether the dataset has a
// workflow, etc

import { createReducer } from '@reduxjs/toolkit'

import { RootState } from '../../../store/store'
import { Dataset, NewDataset } from '../../../qri/dataset'
import { ApiErr, NewApiErr } from '../../../store/api'

export const selectDsPreview = (state: RootState): any => state.dsPreview.preview

export const selectIsDsPreviewLoading = (state: RootState): boolean => state.dsPreview.loading
export const selectDsPreviewError = (state: RootState): ApiErr => state.dsPreview.error

export interface DsPreviewState {
  preview: Dataset
  hasWorkflow: boolean
  loading: boolean
  error: ApiErr
}

const initialState: DsPreviewState = {
  preview: NewDataset({}),
  hasWorkflow: false,
  loading: false,
  error: NewApiErr()
}

export const dsPreviewReducer = createReducer(initialState, {
  'DS_PREVIEW_REQUEST': (state) => {
    state.loading = true
  },
  'DS_PREVIEW_SUCCESS': (state) => {
    state.loading = false
  },
  'DS_PREVIEW_FAILURE': (state) => {
    state.loading = false
  },

  'API_PREVIEW_REQUEST': (state) => {
    state.preview = NewDataset({})
    state.loading = true
    state.error = NewApiErr()
  },
  'API_PREVIEW_FAILURE': (state, action) => {
    state.loading = false
    state.error = action.payload.err
  },
  'API_PREVIEW_SUCCESS': (state, action) => {
    state.preview = {
      ...state.preview,
      ...NewDataset(action.payload.data)
    }
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
  'API_WORKFLOW_SUCCESS': (state, action) => {
    state.hasWorkflow = true
  },
})
