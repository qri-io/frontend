import { QriRef } from '../../../qri/ref'
import { newVersionInfo, VersionInfo } from '../../../qri/versionInfo'
import { CALL_API, ApiActionThunk, ApiAction } from '../../../store/api'

export function mapCommits (d: object | []): VersionInfo[] {
  return (d as Array<Record<string, any>>).map(newVersionInfo)
}

export function loadDatasetCommits (qriRef: QriRef): ApiActionThunk {
  return async (dispatch, getState) => {
    return dispatch(fetchDatasetCommits(qriRef))
  }
}

function fetchDatasetCommits (qriRef: QriRef): ApiAction {
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
