import { createReducer } from '@reduxjs/toolkit'
import { Dataset, NewDataset, Body, NewMeta } from "../../../qri/dataset"
import { RootState } from "../../../store/store"
import {
  DatasetEditorSetFileAction,
  DatasetEditorSetMetaAction,
  DatasetEditorSetReadmeAction,
  DatasetEditorSetTextAction
} from "./datasetEditorActions"

export const SET_MANUAL_DATASET_CREATION_COMMIT_TITLE = 'SET_MANUAL_DATASET_CREATION_COMMIT_TITLE'
export const SET_MANUAL_DATASET_CREATION_TITLE = 'SET_MANUAL_DATASET_CREATION_TITLE'
export const SET_MANUAL_DATASET_CREATION_README = 'SET_MANUAL_DATASET_CREATION_README'
export const SET_MANUAL_DATASET_CREATION_META = 'SET_MANUAL_DATASET_CREATION_META'
export const SET_MANUAL_DATASET_CREATION_FILE = 'SET_MANUAL_DATASET_CREATION_FILE'
export const RESET_MANUAL_DATASET_CREATION_STATE = 'RESET_MANUAL_DATASET_CREATION_STATE'

export const selectDatasetEditorDataset = (state: RootState): Dataset => state.datasetEditor.dataset

export const selectDatasetEditorFile = (state: RootState): File | undefined => state.datasetEditor.file

export const selectDatasetEditorLoading = (state: RootState): boolean => state.datasetEditor.loading

export const selectDatasetEditorError = (state: RootState): string => state.datasetEditor.error

export interface DatasetEditorState {
  dataset: Dataset
  loading: boolean
  error: string
  // file is used to store the file reference when POSTing a body via form data
  file?: File
}

const initialState: DatasetEditorState = {
  dataset: NewDataset({
    meta: {
      title: 'Untitled Dataset'
    },
    readme: {}
  }),
  loading: false,

  error: ''
}

export const datasetEditorReducer = createReducer(initialState, {
  SET_MANUAL_DATASET_CREATION_FILE: (state: DatasetEditorState, action: DatasetEditorSetFileAction) => {
    state.file = action.file
  },
  SET_MANUAL_DATASET_CREATION_README: (state: DatasetEditorState, action: DatasetEditorSetReadmeAction) => {
    state.dataset.readme = action.readme
  },
  SET_MANUAL_DATASET_CREATION_TITLE: (state: DatasetEditorState, action: DatasetEditorSetTextAction) => {
    state.dataset.meta = NewMeta({
      ...state.dataset.meta,
      title: action.text
    })
  },
  SET_MANUAL_DATASET_CREATION_META: (state: DatasetEditorState, action: DatasetEditorSetMetaAction) => {
    state.dataset.meta = action.meta
  },

  'API_SAVEUPLOAD_REQUEST': (state: DatasetEditorState, action) => {
    state.error = ''
    state.loading = true
  },
  'API_SAVEUPLOAD_SUCCESS': (state: DatasetEditorState, action) => {
    state.loading = false
  },
  'API_SAVEUPLOAD_FAILURE': (state: DatasetEditorState, action) => {
    state.error = action.payload.err.message
    state.loading = false
  },
  'API_COMMIT_REQUEST': (state: DatasetEditorState, action) => {
    state.error = ''
    state.loading = true
  },
  'API_COMMIT_SUCCESS': (state: DatasetEditorState, action) => {
    state.loading = false
  },
  'API_COMMIT_FAILURE': (state: DatasetEditorState, action) => {
    state.error = action.payload.err.message
    state.loading = false
  },
  RESET_MANUAL_DATASET_CREATION_STATE: (state: DatasetEditorState, action) => {
    return initialState
  },
  'API_DATASET_SUCCESS': (state, action) => {
    // when the "active dataset" is loaded, write it here for editing
    state.dataset = action.payload.data as Dataset
    state.file = undefined
  },
  'API_BODY_SUCCESS': (state, action) => {
    // when the "active dataset" body is loaded, write it here for editing
    state.dataset.body = action.payload.data as Body
    state.file = undefined
  }
})
