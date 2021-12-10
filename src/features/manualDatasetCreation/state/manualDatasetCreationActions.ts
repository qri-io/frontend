import { ApiActionThunk, CALL_API } from "../../../store/api"
import {
  SET_MANUAL_DATASET_CREATION_META,
  SET_MANUAL_DATASET_CREATION_README,
  SET_MANUAL_DATASET_CREATION_TITLE,
  SET_MANUAL_DATASET_CREATION_FILE,
  RESET_MANUAL_DATASET_CREATION_STATE
} from "./manualDatasetCreationState"
import { Meta, Dataset } from "../../../qri/dataset"
import { QriRef } from "../../../qri/ref"

export interface ResetManualDatasetCreationState {
  type: string
}

export interface ManualDatasetCreationSetTextAction {
  type: string
  text: string
}

export interface ManualDatasetCreationSetMetaAction {
  type: string
  meta: Meta
}

export interface ManualDatasetCreationSetFileAction {
  type: string
  file: File | undefined
}

export function setManualDatasetCreationTitle (title: string): ManualDatasetCreationSetTextAction {
  return {
    type: SET_MANUAL_DATASET_CREATION_TITLE,
    text: title
  }
}

export function setManualDatasetCreationReadme (readme: string): ManualDatasetCreationSetTextAction {
  return {
    type: SET_MANUAL_DATASET_CREATION_README,
    text: readme
  }
}

export function setManualDatasetCreationMeta (meta: Meta): ManualDatasetCreationSetMetaAction {
  return {
    type: SET_MANUAL_DATASET_CREATION_META,
    meta
  }
}

export function setManualDatasetCreationFile (file: File): ManualDatasetCreationSetFileAction {
  return {
    type: SET_MANUAL_DATASET_CREATION_FILE,
    file
  }
}

export function resetManualDatasetCreationState (): ResetManualDatasetCreationState {
  return {
    type: RESET_MANUAL_DATASET_CREATION_STATE
  }
}

export function saveManualDataset (ref: QriRef, bodyFile: File, dataset: Dataset, commitTitle: string): ApiActionThunk {
  return async (dispatch, getState) => {
    return dispatch({
      type: 'saveupload',
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
    })
  }
}
