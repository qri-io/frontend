import { QriRef } from "../../../qri/ref";
import { ApiAction, ApiActionThunk, CALL_API } from "../../../store/api";

export function loadDsPreview(ref: QriRef): ApiActionThunk {
  return async (dispatch, getState) => {
    await Promise.all([dispatch(fetchDsPreview(ref))])
    dispatch(fetchDsPreviewBody(ref))
    dispatch(fetchDsPreviewReadme(ref))
    return dispatch(fetchPreviewDone(ref))
  }
}

export const bodyPageSizeDefault = 50

function fetchDsPreview (ref: QriRef): ApiAction {
  return {
    type: 'datasetpreview',
    ref,
    [CALL_API]: {
      endpoint: 'ds/get',
      method: 'GET',
      segments: ref
    }
  }
}

function fetchDsPreviewBody (ref: QriRef, page: number = 1, pageSize: number = bodyPageSizeDefault): ApiAction {
  return {
    type: 'datasetpreviewbody',
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
      },
    }
  }
}

function fetchDsPreviewReadme (ref: QriRef): ApiAction {
  return {
    type: 'datasetpreviewreadme',
    ref,
    [CALL_API]: {
      endpoint: 'ds/get',
      method: 'GET',
      segments: {
        username: ref.username,
        name: ref.name,
        path: ref.path,
        selector: ['readme']
      },
    }
  }
}

function fetchPreviewDone (ref: QriRef): ApiAction {
  return {
    type: 'datasetpreviewfetchdone',
    ref
  }
}