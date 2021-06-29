import { QriRef } from '../../../qri/ref'
import { CALL_API, ApiActionThunk, ApiAction } from '../../../store/api'
import { LogItem, NewLogItem } from '../../../qri/log'

export function mapLogs(d: object | []): LogItem[] {
  return (d as Record<string,any>[]).map(NewLogItem)
}

export function loadDatasetLogs(qriRef: QriRef): ApiActionThunk {
  return async (dispatch, getState) => {
    return dispatch(fetchDatasetLogs(qriRef))
  }
}

function fetchDatasetLogs(qriRef: QriRef): ApiAction {
  return {
    type: 'dataset_logs',
    qriRef,
    [CALL_API]: {
      endpoint: `ds/activity`,
      method: 'POST',
      body: {
        ref: `${qriRef.username}/${qriRef.name}`
      },
      map: mapLogs
    }
  }
}