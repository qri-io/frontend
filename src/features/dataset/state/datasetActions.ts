import Dataset, { NewDataset } from "../../../qri/dataset"
import { QriRef, refStringFromQriRef, humanRef } from "../../../qri/ref"
import { ApiAction, ApiActionThunk, CALL_API, API_BASE_URL } from "../../../store/api"
import {
  RENAME_NEW_DATASET,
  RESET_DATASET_STATE,
  RESET_DATASET_TITLE_ERROR,
  SET_BODY_LOADING,
  SET_HEADER
} from "./datasetState"
import { VersionInfo } from "../../../qri/versionInfo"

export const DEFAULT_BODY_PAGE_SIZE = 100

export function mapDataset (d: object | []): Dataset {
  return NewDataset((d as Record<string, any>))
}

export function loadDataset (ref: QriRef): ApiActionThunk {
  return async (dispatch, getState) => {
    // TODO (b5) - check state before making a network request
    return dispatch(fetchDataset(ref))
  }
}

export function loadHeader (ref: QriRef): ApiActionThunk {
  return async (dispatch, getState) => {
    if (getState) {
      const state = getState()
      const existingHeader: VersionInfo | undefined = getExistingHeader(state.collection.collection, ref)
      if (existingHeader) { return dispatch(setHeader(existingHeader)) }
    }
    return dispatch(fetchHeader(ref))
  }
}

function getExistingHeader (collection: Record<string, VersionInfo>, ref: QriRef): VersionInfo | undefined {
  for (const k in collection) {
    if (collection[k].name === ref.name && collection[k].username === ref.username) {
      return collection[k]
    }
  }
  return undefined
}

export function renameDataset (current: QriRef, next: QriRef): ApiActionThunk {
  // if no path exists, assume a new dataset & client-side-only rename
  // TODO(b5): once QriRefs have an initID field, use that as the proper check
  // for "newness"
  if (!current.path) {
    return async () => ({
      type: RENAME_NEW_DATASET,
      current,
      next
    })
  }

  return async (dispatch) => {
    const action = {
      type: 'rename',
      [CALL_API]: {
        endpoint: 'ds/rename',
        method: 'POST',
        body: {
          current: refStringFromQriRef(humanRef(current)),
          next: refStringFromQriRef(humanRef(next))
        }
      }
    }

    return dispatch(action)
  }
}

// downloadLinkFromQriRef creates a download link
export function downloadLinkFromQriRef (ref: QriRef, body: boolean = false): string {
  let pathSegment = ref.path ? `/at${ref.path}` : ''

  if (body) {
    return `${API_BASE_URL}/ds/get/${ref.username}/${ref.name}${pathSegment}/body.csv`
  }
  return `${API_BASE_URL}/ds/get/${ref.username}/${ref.name}${pathSegment}?format=zip`
}

function fetchHeader (ref: QriRef) {
  // fetchHeader fetches a specified `VersionInfo` from the collection
  // TODO(boandriy): this endpoint ('collection/get') returns a `VersionInfo`, but
  // this return type may change in the future when the specific "dataset details"
  // that a user wants to see on the dataset page settles. We may then have a new
  // data structure that returns from the 'collection/get' endpoint
  return {
    type: 'header',
    [CALL_API]: {
      endpoint: 'collection/get',
      method: 'POST',
      body: {
        ref: ref.username + '/' + ref.name
      }
    }
  }
}

function fetchDataset (ref: QriRef): ApiAction {
  return {
    type: 'dataset',
    ref,
    [CALL_API]: {
      endpoint: 'ds/get',
      method: 'GET',
      segments: ref,
      map: mapDataset
    }
  }
}

export function loadBody (ref: QriRef, offset: number = 0, limit: number = DEFAULT_BODY_PAGE_SIZE): ApiActionThunk {
  return async (dispatch) => {
    return dispatch(fetchBody(ref, offset, limit))
  }
}

function fetchBody (ref: QriRef, offset: number, limit: number): ApiAction {
  return {
    type: 'body',
    ref,
    [CALL_API]: {
      endpoint: 'ds/get',
      method: 'GET',
      query: {
        limit: limit.toString(),
        offset: offset.toString()
      },
      segments: {
        username: ref.username,
        name: ref.name,
        path: ref.path,
        selector: ['body']
      }
    }
  }
}

export function commitDatasetTitle (qriRef: QriRef, title: string, commitTitle: string): ApiActionThunk {
  return async (dispatch) => {
    const action = {
      type: 'title',
      [CALL_API]: {
        endpoint: 'ds/save',
        method: 'POST',
        body: {
          ref: `${qriRef.username}/${qriRef.name}`,
          title: commitTitle,
          dataset: {
            meta: {
              title: title
            }
          }
        }
      }
    }

    return dispatch(action)
  }
}

export function removeDataset (ref: QriRef): ApiActionThunk {
  return async (dispatch) => {
    const action = {
      type: 'remove',
      [CALL_API]: {
        endpoint: 'ds/remove',
        method: 'POST',
        body: {
          ref: refStringFromQriRef(ref)
        }
      }
    }

    return dispatch(action)
  }
}

export interface RenameDatasetAction {
  type: string
  current: QriRef
  next: QriRef
}

export interface ResetDatasetStateAction {
  type: string
}

export function setHeader (header: VersionInfo) {
  return {
    type: SET_HEADER,
    payload: header
  }
}

export function resetDatasetState (): ResetDatasetStateAction {
  return {
    type: RESET_DATASET_STATE
  }
}

export function setBodyLoading (): ResetDatasetStateAction {
  return {
    type: SET_BODY_LOADING
  }
}

export function resetDatasetTitleError (): ResetDatasetStateAction {
  return {
    type: RESET_DATASET_TITLE_ERROR
  }
}
