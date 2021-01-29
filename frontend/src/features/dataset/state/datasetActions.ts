import Dataset, { NewDataset } from "../../../qri/dataset";
import { QriRef } from "../../../qri/ref";
import { ApiAction, ApiActionThunk, CALL_API } from "../../../store/api";

export function mapDataset(d: object | []): Dataset {
  return NewDataset((d as Record<string,any>).dataset)
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