import { createReducer } from '@reduxjs/toolkit'
import { Meta } from "../../../qri/dataset"
import { RootState } from "../../../store/store"
import {
  ManualDatasetCreationSetFileAction,
  ManualDatasetCreationSetMetaAction,
  ManualDatasetCreationSetTextAction
} from "./manualDatasetCreationActions"

export const SET_MANUAL_DATASET_CREATION_COMMIT_TITLE = 'SET_MANUAL_DATASET_CREATION_COMMIT_TITLE'
export const SET_MANUAL_DATASET_CREATION_TITLE = 'SET_MANUAL_DATASET_CREATION_TITLE'
export const SET_MANUAL_DATASET_CREATION_README = 'SET_MANUAL_DATASET_CREATION_README'
export const SET_MANUAL_DATASET_CREATION_META = 'SET_MANUAL_DATASET_CREATION_META'
export const SET_MANUAL_DATASET_CREATION_FILE = 'SET_MANUAL_DATASET_CREATION_FILE'
export const RESET_MANUAL_DATASET_CREATION_STATE = 'RESET_MANUAL_DATASET_CREATION_STATE'

export const selectManualDatasetTitle = (state: RootState): string => state.manualDatasetCreation.datasetTitle

export const selectManualDatasetCommitTitle = (state: RootState): string => state.manualDatasetCreation.commitTitle

export const selectManualDatasetReadme = (state: RootState): string => state.manualDatasetCreation.readme

export const selectManualDatasetMeta = (state: RootState): Meta => state.manualDatasetCreation.meta

export const selectManualDatasetFile = (state: RootState): File | undefined => state.manualDatasetCreation.file

export const selectManualDatasetFileUploading = (state: RootState): boolean => state.manualDatasetCreation.fileUploading

export const selectManualDatasetUploadError = (state: RootState): string => state.manualDatasetCreation.uploadError

export interface ManualDatasetCreationState {
  fileUploading: boolean
  meta: Meta
  commitTitle: string
  datasetTitle: string
  readme: string
  file?: File
  uploadError: string
}

const initialState: ManualDatasetCreationState = {
  fileUploading: false,
  meta: {
    qri: ''
  },
  commitTitle: 'new.manual.dataset',
  readme: '',
  datasetTitle: 'new-dataset',
  uploadError: ''
}

export const manualDatasetCreationReducer = createReducer(initialState, {
  SET_MANUAL_DATASET_CREATION_FILE: (state: ManualDatasetCreationState, action: ManualDatasetCreationSetFileAction) => {
    state.file = action.file
  },
  SET_MANUAL_DATASET_CREATION_COMMIT_TITLE: (state: ManualDatasetCreationState, action: ManualDatasetCreationSetTextAction) => {
    state.commitTitle = action.text
  },
  SET_MANUAL_DATASET_CREATION_README: (state: ManualDatasetCreationState, action: ManualDatasetCreationSetTextAction) => {
    state.readme = action.text
  },
  SET_MANUAL_DATASET_CREATION_META: (state: ManualDatasetCreationState, action: ManualDatasetCreationSetMetaAction) => {
    state.meta = action.meta
  },
  SET_MANUAL_DATASET_CREATION_TITLE: (state: ManualDatasetCreationState, action: ManualDatasetCreationSetTextAction) => {
    state.datasetTitle = action.text
  },
  'API_SAVEUPLOAD_REQUEST': (state: ManualDatasetCreationState, action) => {
    state.fileUploading = true
  },
  'API_SAVEUPLOAD_SUCCESS': (state: ManualDatasetCreationState, action) => {
    state.fileUploading = false
  },
  'API_SAVEUPLOAD_FAILURE': (state: ManualDatasetCreationState, action) => {
    state.uploadError = action.payload.err.message
    state.fileUploading = false
  },
  RESET_MANUAL_DATASET_CREATION_STATE: (state: ManualDatasetCreationState, action) => {
    return initialState
  }
})
