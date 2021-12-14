import { ApiActionThunk, CALL_API } from "../../../store/api"
import {
  SET_MANUAL_DATASET_CREATION_META,
  SET_MANUAL_DATASET_CREATION_README,
  SET_MANUAL_DATASET_CREATION_TITLE,
  SET_MANUAL_DATASET_CREATION_FILE,
  RESET_MANUAL_DATASET_CREATION_STATE
} from "./datasetEditorState"
import { Meta, Dataset, Readme } from "../../../qri/dataset"
import { QriRef } from "../../../qri/ref"

export interface ResetDatasetEditorState {
  type: string
}

export interface DatasetEditorSetTextAction {
  type: string
  text: string
}

export interface DatasetEditorSetReadmeAction {
  type: string
  readme: Readme
}

export interface DatasetEditorSetMetaAction {
  type: string
  meta: Meta
}

export interface DatasetEditorSetFileAction {
  type: string
  file: File | undefined
}

export function setDatasetEditorTitle (title: string): DatasetEditorSetTextAction {
  return {
    type: SET_MANUAL_DATASET_CREATION_TITLE,
    text: title
  }
}

export function setDatasetEditorReadme (readme: Readme): DatasetEditorSetReadmeAction {
  return {
    type: SET_MANUAL_DATASET_CREATION_README,
    readme: readme
  }
}

export function setDatasetEditorMeta (meta: Meta): DatasetEditorSetMetaAction {
  return {
    type: SET_MANUAL_DATASET_CREATION_META,
    meta
  }
}

export function setDatasetEditorFile (file: File): DatasetEditorSetFileAction {
  return {
    type: SET_MANUAL_DATASET_CREATION_FILE,
    file
  }
}

export function resetDatasetEditorState (): ResetDatasetEditorState {
  return {
    type: RESET_MANUAL_DATASET_CREATION_STATE
  }
}

export function commitDataset (ref: QriRef, dataset: Dataset, commitTitle: string, bodyFile?: File): ApiActionThunk {
  return async (dispatch) => {
    return await commitDatasetUpdate(ref, dataset, commitTitle, bodyFile)(dispatch)
  }
}

export function commitDatasetUpdate (ref: QriRef, dataset: Dataset, commitTitle: string, bodyFile?: File): ApiActionThunk {
  return async (dispatch) => {
    const action = {
      type: 'commit',
      [CALL_API]: {
        endpoint: 'ds/save/upload',
        method: 'POST',
        form: {
          'ref': `${ref.username + '/' + ref.name}`,
          'body': bodyFile,
          'dataset': JSON.stringify(dataset),
          'title': commitTitle
        },
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    }
    return dispatch(action)
  }
}
