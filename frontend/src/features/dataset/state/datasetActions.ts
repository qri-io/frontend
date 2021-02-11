import Dataset, { NewDataset } from "../../../qri/dataset";
import { QriRef } from "../../../qri/ref";
import { ApiAction, ApiActionThunk, CALL_API } from "../../../store/api";

export const bodyPageSizeDefault = 50

export function mapDataset(d: object | []): Dataset {
  return NewDataset((d as Record<string,any>).dataset)
}

export function mapBody (d: {data: Body}): Body {
  return d.data
}

export function loadDataset(ref: QriRef): ApiActionThunk {
  return async (dispatch, getState) => {
    // TODO (b5) - check state before making a network request
    return dispatch(fetchDataset(ref))
  }
}

function fetchDataset (ref: QriRef): ApiAction {
  return {
    type: 'dataset',
    ref,
    [CALL_API]: {
      endpoint: 'get',
      method: 'GET',
      segments: {
        peername: ref.username,
        name: ref.name
      },
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
      endpoint: 'body',
      method: 'GET',
      pageInfo: {
        page,
        pageSize
      },
      segments: {
        peername: ref.username,
        name: ref.name
      },
      map: mapBody
    }
  }
}