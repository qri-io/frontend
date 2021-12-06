import { QriRef } from '../../../qri/ref'
import { CALL_API, ApiActionThunk, ApiAction } from '../../../store/api'
import { LogItem, NewLogItem } from '../../../qri/log'

export function mapLogs (d: object | []): LogItem[] {
  return (d as Array<Record<string, any>>).map(NewLogItem)
}

export function loadDatasetLogs (qriRef: QriRef): ApiActionThunk {
  return async (dispatch, getState) => {
    return dispatch(fetchDatasetLogs(qriRef))
  }
}

function fetchDatasetLogs (qriRef: QriRef): ApiAction {
  return {
    type: 'dataset_activity_runs',
    qriRef,
    [CALL_API]: {
      endpoint: `ds/activity`,
      method: 'POST',
      body: {
        ref: `${qriRef.username}/${qriRef.name}`,
        limit: 500,
        term: 'run'
      },
      map: mapLogs
    }
  }
}

export function loadRunInfo (runId: string): ApiActionThunk {
  return async (dispatch, getState) => {
    return dispatch(fetchRunInfo(runId))
  }
}

function fetchRunInfo (runId: string): ApiAction {
  return {
    type: 'dataset_activity_runinfo',
    [CALL_API]: {
      endpoint: `auto/runinfo`,
      method: 'POST',
      body: {
        id: runId
      },
      requestID: runId
    }
  }
}
