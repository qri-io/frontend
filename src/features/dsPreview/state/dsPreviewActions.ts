import { QriRef, refStringFromQriRef } from "../../../qri/ref";
import { ApiAction, ApiActionThunk, CALL_API } from "../../../store/api";

export function loadDsPreview(ref: QriRef): ApiActionThunk {
  return async (dispatch, getState) => {
    dispatch({ type: 'DS_PREVIEW_REQUEST' })

    try {
      await Promise.all([
        // dispatch(fetchDsPreview(ref)),
        dispatch(fetchDsPreviewBody(ref)),
        dispatch(fetchDsPreviewReadme(ref)),
      ])

      return dispatch({
        type: 'DS_PREVIEW_SUCCESS',
        ref
      })
    } catch (e) {
      return dispatch({
        type: 'DS_PREVIEW_FAILURE',
        error: e.toString(),
      })
    }
  }
}

export const bodyPageSizeDefault = 50

export function fetchDsPreview (ref: QriRef): ApiAction {
  return {
    type: 'preview',
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
    type: 'previewbody',
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
    type: 'previewreadme',
    ref,
    [CALL_API]: {
      endpoint: 'ds/render',
      method: 'POST',
      body: {
        ref: refStringFromQriRef(ref),
        selector: 'readme'
      }
    }
  }
}
