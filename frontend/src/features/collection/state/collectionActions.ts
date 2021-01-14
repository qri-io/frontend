import { newVersionInfo, VersionInfo } from "../../../qri/versionInfo"
import { ApiAction, ApiActionThunk, CALL_API } from "../../../store/api"

function mapVersionInfo (data: object | []): VersionInfo[] {
  return (data as []).map((data) => newVersionInfo(data))
}

export function loadDatasets (page: number = 1, pageSize = 50): ApiActionThunk {
  return async (dispatch, getState) => {
    // TODO (b5) - check state before making a network request
    return dispatch(fetchDatasets(page, pageSize))
  }
}

function fetchDatasets (page: number = 1, pageSize: number = 50): ApiAction {
  return {
    type: 'list',
    [CALL_API]: {
      endpoint: 'list',
      method: 'GET',
      pageInfo: {
        page,
        pageSize
      },
      map: mapVersionInfo
    }
  }
}