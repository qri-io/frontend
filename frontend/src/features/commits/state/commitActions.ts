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
  console.log('loading dataset commits', qriRef.username, qriRef.name)
  return {
    type: 'dataset_commits',
    qriRef,
    [CALL_API]: {
      endpoint: `history/${qriRef.username}/${qriRef.name}`,
      method: 'GET',
      map: mapCommits
    }
  }
}