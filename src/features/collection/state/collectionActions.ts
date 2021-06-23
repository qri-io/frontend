import { ApiAction, CALL_API } from "../../../store/api"
import { newVersionInfo, VersionInfo } from "../../../qri/versionInfo"
import { NewWorkflow, workflowInfoFromWorkflow } from "../../../qrimatic/workflow"
import { WORKFLOW_COMPLETED, WORKFLOW_STARTED } from "./collectionState"
import { AnyAction } from "redux"

function mapVersionInfo (data: object | []): VersionInfo[] {
  if (!data) { return [] }
  return (data as []).map((data) => newVersionInfo(data))
}

export function loadCollection() {
  return async (dispatch, getState) => {
    return dispatch(fetchCollection())
  }
}

function fetchCollection (): ApiAction {
  return {
    type: 'collection',
    [CALL_API]: {
      endpoint: 'list',
      method: 'POST',
      body: {
        offset: 0,
        limit: 300 // TODO(chriswhong): For now, we assume the client has the entire collection and can sort and filter locally
      },
      map: mapVersionInfo
    }
  }
}

// workflowStarted is dispatched by the websocket and users should not need to
// dispatch it anywhere else
export function workflowStarted(workflow: Record<string, any>): AnyAction {
  const wf = NewWorkflow(workflow)
  return {
    type: WORKFLOW_STARTED,
    data: workflowInfoFromWorkflow(wf)
  }
}

// workflowCompleted is dispatched by the websocket and users should not need to
// dispatch it anywhere else
export function workflowCompleted(workflow: Record<string, any>): AnyAction {
  const wf = NewWorkflow(workflow)
  return {
    type: WORKFLOW_COMPLETED,
    data: workflowInfoFromWorkflow(wf)
  }
}
