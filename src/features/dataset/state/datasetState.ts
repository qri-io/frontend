import { createReducer } from '@reduxjs/toolkit'

import { RootState } from '../../../store/store'
import Dataset, { Meta, NewDataset, Readme } from '../../../qri/dataset'
import { qriRefFromString } from '../../../qri/ref'
import {
  RenameDatasetAction,
  ResetDatasetStateAction, SetDatasetCommitTitleAction, SetDatasetEditableAction,
  SetDatasetMetaAction,
  SetDatasetReadmeAction
} from './datasetActions'
import { selectSessionUser } from '../../session/state/sessionState'
import { newVersionInfo, VersionInfo } from "../../../qri/versionInfo"
import { ApiResponseAction } from "../../../store/api"

export const RENAME_NEW_DATASET = 'RENAME_NEW_DATASET'

export const SET_HEADER = 'SET_HEADER'

export const RESET_DATASET_STATE = 'RESET_DATASET_STATE'

export const SET_BODY_LOADING = 'SET_BODY_LOADING'

export const RESET_DATASET_TITLE_ERROR = 'RESET_DATASET_TITLE_ERROR'

export const SET_DATASET_IS_EDITABLE = 'SET_DATASET_IS_EDITABLE'

export const SET_DATASET_META = 'SET_DATASET_META'

export const SET_DATASET_README = 'SET_DATASET_README'

export const SET_DATASET_COMMIT_TITLE = 'SET_DATASET_COMMIT_TITLE'

export const selectDataset = (state: RootState): Dataset => state.dataset.dataset

export const selectEditableDataset = (state: RootState): Dataset => state.dataset.editableDataset

export const selectDatasetHeader = (state: RootState): VersionInfo => state.dataset.header

export const selectCommitCount = (state: RootState): number => state.dataset.header.commitCount

export const selectRunCount = (state: RootState): number => state.dataset.header.runCount

export const selectCommitLoading = (state: RootState): boolean => state.dataset.commitLoading

export const selectCommitError = (state: RootState): string => state.dataset.commitError

export const selectIsDatasetLoading = (state: RootState): boolean => state.dataset.datasetLoading

export const selectIsBodyLoading = (state: RootState): boolean => state.dataset.bodyLoading

export const selectIsHeaderLoading = (state: RootState): boolean => state.dataset.headerLoading

export const selectTitleError = (state: RootState): string => state.dataset.titleError

export const selectDatasetMeta = (state: RootState): Meta | undefined => state.dataset.dataset.meta

export const selectEditableDatasetMeta = (state: RootState): Meta | undefined => state.dataset.editableDataset.meta

export const selectEditableDatasetReadme = (state: RootState): Readme | undefined => state.dataset.editableDataset.readme

export const selectIsDatasetEditable = (state: RootState): boolean => state.dataset.isDatasetEditable

export const selectDatasetNewCommitTitle = (state: RootState): string => state.dataset.commitTitle

export const selectSessionUserCanEditDataset = (state: RootState): boolean => {
  const u = selectSessionUser(state)
  if (state.dataset.headerLoading) {
    return false
  }
  // TODO(b5) - this would ideally be checking for an existing dataset ID instead
  // of a path
  if (state.dataset.header.path === '') {
    return true
  }
  return u.username === state.dataset.header.username
}

export interface DatasetState {
  dataset: Dataset
  editableDataset: Dataset
  // TODO(boandriy): header is currently a `VersionInfo`, but will have its own data structure in future iterations
  header: VersionInfo
  datasetLoading: boolean
  headerLoading: boolean
  bodyLoading: boolean
  titleError: string
  isDatasetEditable: boolean
  commitTitle: string
  // Used to display loader during commit request
  commitLoading: boolean
  commitError: string
}

const initialState: DatasetState = {
  dataset: NewDataset({}),
  editableDataset: NewDataset({}),
  header: newVersionInfo({}),
  datasetLoading: true,
  headerLoading: true,
  bodyLoading: true,
  titleError: '',
  isDatasetEditable: false,
  commitTitle: '',
  commitLoading: false,
  commitError: ''
}

export const datasetReducer = createReducer(initialState, {
  'API_TITLE_REQUEST': (state: DatasetState) => {
    state.datasetLoading = true
    state.titleError = ''
  },
  'API_TITLE_SUCCESS': (state: DatasetState) => {
    state.datasetLoading = false
  },
  'API_TITLE_FAILURE': (state: DatasetState, action: ApiResponseAction) => {
    state.datasetLoading = false
    state.titleError = action.payload.err.message
  },
  'API_HEADER_REQUEST': (state) => {
    state.headerLoading = true
    state.header = newVersionInfo({})
  },
  'API_HEADER_SUCCESS': (state, action) => {
    state.headerLoading = false
    state.header = newVersionInfo(action.payload.data)
  },
  'API_HEADER_FAILURE': (state) => {
    state.headerLoading = false
  },
  SET_HEADER: (state, action) => {
    state.headerLoading = false
    state.header = action.payload
  },
  'API_DATASET_REQUEST': (state) => {
    state.dataset = NewDataset({})
    state.editableDataset = NewDataset({})
    state.datasetLoading = true
  },
  'API_DATASET_SUCCESS': (state, action) => {
    state.dataset = action.payload.data as Dataset
    state.editableDataset = action.payload.data as Dataset
    state.datasetLoading = false
    state.bodyLoading = false
  },
  'API_DATASET_FAILURE': (state) => {
    state.datasetLoading = false
    state.bodyLoading = false
  },
  'API_BODY_REQUEST': (state, action) => {
    state.bodyLoading = true
  },
  'API_BODY_SUCCESS': (state, action) => {
    state.dataset.body = action.payload.data as Body
    state.editableDataset.body = action.payload.data as Body
    state.bodyLoading = false
  },
  'API_BODY_FAILURE': (state, action) => {
    state.bodyLoading = false
  },
  'API_REMOVE_SUCCESS': (state, action) => {
    const ref = qriRefFromString(action.payload.data.ref)
    if (state.dataset.peername === ref.username && state.dataset.name === ref.name) {
      state.dataset = NewDataset({})
      state.editableDataset = NewDataset({})
    }
  },
  'API_RENAME_SUCCESS': (state, action) => {
    // TODO(b5): finish
  },
  'API_COMMIT_REQUEST': (state, action) => {
    state.commitLoading = true
  },
  'API_COMMIT_SUCCESS': (state, action) => {
    state.commitLoading = false
  },
  'API_COMMIT_FAILURE': (state, action) => {
    state.commitError = action.payload.err.message
    state.commitLoading = false
  },
  RESET_DATASET_STATE: (state: DatasetState, action: ResetDatasetStateAction) => {
    return initialState
  },
  RENAME_NEW_DATASET: (state: DatasetState, action: RenameDatasetAction) => {
    state.header.name = action.next.name
  },
  SET_BODY_LOADING: (state: DatasetState, action: ResetDatasetStateAction) => {
    state.bodyLoading = true
  },
  RESET_DATASET_TITLE_ERROR: (state: DatasetState, action: ResetDatasetStateAction) => {
    state.titleError = ''
  },
  SET_DATASET_META: (state: DatasetState, action: SetDatasetMetaAction) => {
    state.editableDataset.meta = action.meta
  },
  SET_DATASET_README: (state: DatasetState, action: SetDatasetReadmeAction) => {
    state.editableDataset.readme = action.readme
  },
  SET_DATASET_IS_EDITABLE: (state: DatasetState, action: SetDatasetEditableAction) => {
    if (!action.editable) {
      state.editableDataset = NewDataset(state.dataset)
    }
    state.isDatasetEditable = action.editable
  },
  SET_DATASET_COMMIT_TITLE: (state: DatasetState, action: SetDatasetCommitTitleAction) => {
    state.commitTitle = action.title
  }
})
