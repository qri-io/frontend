import { ApiAction, ApiActionThunk, CALL_API } from "../../../store/api";
import { newQriRef, QriRef } from "../../../qri/ref";
import { mapDataset } from "./datasetVersionActions";
import { EDIT_DATASET } from "./editDatasetState";
import Dataset from "../../../qri/dataset";

export interface EditDatasetAction {
  type: string
  ref: QriRef
  value: any
}

export function editDataset(ref: QriRef, value: any): EditDatasetAction {
  return {
    type: EDIT_DATASET,
    ref,
    value,
  }
}

export function loadEditingDatasetHead(ref: QriRef): ApiActionThunk {
  return async (dispatch, getState) => {
    ref = newQriRef({
      username: ref.username,
      name: ref.name,
      // TODO(b5) - should provide initID
    })
    // TODO (b5) - check state before making a network request
    return dispatch(fetchEditingDatasetHead(ref))
  }
}

function fetchEditingDatasetHead(ref: QriRef): ApiAction {
  return {
    type: 'editing_dataset_head',
    ref,
    [CALL_API]: {
      endpoint: 'get',
      method: 'GET',
      segments: ref,
      map: mapDataset
    }
  }
}

export function saveDataset(ds: Dataset): ApiActionThunk {
  const ref = newQriRef({ username: ds.peername, name: ds.name })
  return async (dispatch, getState) => {
    return dispatch({
      type: 'save',
      ref,
      [CALL_API]: {
        endpoint: `save?refstr=${ref.username}/${ref.name}`,
        method: 'POST',
        // segments: ref,
        map: mapDataset,
        body: {
          dataset: ds
        }
        // body: {
        //   ref: ref,
        //   dataset: ds
        // }
      }
    })
  }
}
