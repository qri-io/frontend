import Dataset, { NewDataset } from "../../../qri/dataset"
import { QriRef, refStringFromQriRef, humanRef } from "../../../qri/ref"
import { ApiAction, ApiActionThunk, CALL_API } from "../../../store/api"
import { RENAME_NEW_DATASET } from "./datasetState"
import { API_BASE_URL } from '../../../store/api'

export const bodyPageSizeDefault = 50

export function mapDataset(d: object | []): Dataset {
  return NewDataset((d as Record<string,any>))
}

export function loadDataset(ref: QriRef): ApiActionThunk {
  return async (dispatch, getState) => {
    // TODO (b5) - check state before making a network request
    return dispatch(fetchDataset(ref))
  }
}

// downloadLinkFromQriRef creates a download link
export function downloadLinkFromQriRef(ref: QriRef, body: boolean = false): string {
  let pathSegment = ref.path ? `/at${ref.path}` : ''

  if (body) {
    return `${API_BASE_URL}/ds/get/${ref.username}/${ref.name}${pathSegment}/body.csv`
  }
  return `${API_BASE_URL}/ds/get/${ref.username}/${ref.name}${pathSegment}?format=zip`
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

export function loadBody(ref: QriRef, page: number = 1, pageSize: number = bodyPageSizeDefault): ApiActionThunk {
  return async (dispatch) => {
    return dispatch(fetchBody(ref, page, pageSize))
  }
}

function fetchBody (ref: QriRef, page: number, pageSize: number): ApiAction {
  return {
    type: 'body',
    ref,
    [CALL_API]: {
      endpoint: 'ds/get',
      method: 'GET',
      pageInfo: {
        page,
        pageSize
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
  type: string,
  current: QriRef
  next: QriRef
}

export function renameDataset(current: QriRef, next: QriRef): ApiActionThunk {
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
          next: refStringFromQriRef(humanRef(next)),
        },
        // TODO(b5): this return value is a versionInfo
        map: mapDataset
      }
    }

    return dispatch(action)
  }
}
