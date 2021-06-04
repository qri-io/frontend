import { QriRef } from "../../../qri/ref";
import { ApiAction, ApiActionThunk, CALL_API } from "../../../store/api";

export function loadDsPreview(ref: QriRef): ApiActionThunk {
  return async (dispatch, getState) => {
    return dispatch(fetchDsPreview(ref))
  }
}

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
