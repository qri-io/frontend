import { QriRef } from "../../../qri/ref"
import { ApiAction, ApiActionThunk, CALL_API } from "../../../store/api"

export function loadDsPreview (ref: QriRef): ApiActionThunk {
  return async (dispatch) => {
    return dispatch(fetchDsPreview(ref))
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
