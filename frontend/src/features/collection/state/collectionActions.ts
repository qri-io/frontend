import { newWorkflowInfo, WorkflowInfo } from "../../../qrimatic/workflow"
import { ApiAction, ApiActionThunk, CALL_API } from "../../../store/api"

function mapVersionInfo (data: object | []): WorkflowInfo[] {
  return (data as []).map((data) => newWorkflowInfo(data))
}

export function loadCollection (page: number = 1, pageSize = 50): ApiActionThunk {
  return async (dispatch, getState) => {
    // TODO (b5) - check state before making a network request
    return dispatch(fetchCollection(page, pageSize))
  }
}

function fetchCollection (page: number = 1, pageSize: number = 50): ApiAction {
  return {
    type: 'collection',
    [CALL_API]: {
      endpoint: 'collection',
      method: 'GET',
      pageInfo: {
        page,
        pageSize
      },
      map: mapVersionInfo
    }
  }
}