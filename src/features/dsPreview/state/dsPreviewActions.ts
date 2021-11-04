import { QriRef } from "../../../qri/ref"
import { ApiAction, ApiActionThunk, CALL_API } from "../../../store/api"

export function loadDsPreview (ref: QriRef): ApiActionThunk {
  return async (dispatch, getState) => {
    dispatch({ type: 'DS_PREVIEW_REQUEST' })

    try {
      await Promise.all([
        // for the moment we don't get a preview explicitly because we already
        // have what we need in state.dataset
        // dispatch(fetchDsPreview(ref)),
        dispatch(fetchDsPreviewBody(ref))
      ])

      return dispatch({
        type: 'DS_PREVIEW_SUCCESS',
        ref
      })
    } catch (e: any) {
      return dispatch({
        type: 'DS_PREVIEW_FAILURE',
        error: e.toString()
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
      }
    }
  }
}
