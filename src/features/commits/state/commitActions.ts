import { QriRef } from '../../../qri/ref'
import { CALL_API, ApiActionThunk, ApiAction } from '../../../store/api'
import { LogItem, NewLogItem } from '../../../qri/log'

export function mapCommits(d: object | []): LogItem[] {
  return (d as Record<string,any>[]).map(NewLogItem)
}

export function loadDatasetCommits(qriRef: QriRef): ApiActionThunk {
  return async (dispatch, getState) => {
    return dispatch(fetchDatasetCommits(qriRef))
  }
}

function fetchDatasetCommits(qriRef: QriRef): ApiAction {
  return {
    type: 'dataset_activity_history',
    qriRef,
    [CALL_API]: {
      endpoint: `ds/activity`,
      method: 'POST',
      body: {
        ref: `${qriRef.username}/${qriRef.name}`,
        limit: 100,
        term: 'history'
      },
      map: mapCommits
    }
  }
}
