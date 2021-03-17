import { AnyAction, Dispatch } from "@reduxjs/toolkit"
import { NewWorkflow, newWorkflowInfo, WorkflowInfo, workflowInfoFromWorkflow } from "../../../qrimatic/workflow"
import { ACTION_FAILURE, ApiAction, ApiActionThunk, CALL_API, getActionType } from "../../../store/api"
import { WorkflowInfoAction } from "../../workflow/state/workflowActions"
import { WORKFLOW_COMPLETED, WORKFLOW_STARTED } from "./collectionState"

function mapWorkflowInfo (data: object | []): WorkflowInfo[] {
  return (data as []).map((data) => newWorkflowInfo(data))
}

export function loadCollection(dispatch: Dispatch, offset: number, limit: number) {
  loadCollectionWorkflows(1, 50)(dispatch)
  .then(async (action: AnyAction) => {
    if (getActionType(action) === ACTION_FAILURE) {
      console.log("load collection failed:", action.payload.err.message)
    }
    return await loadRunningCollection()(dispatch)
  })
  .then((action: AnyAction) => {
    if (getActionType(action) === ACTION_FAILURE) {
      console.log("loading running collection failed:", action.payload.err.message)
    }
  })
}

// loadCollectionWorkflows fetches all the workflows and datasets as WorkflowInfos
export function loadCollectionWorkflows (page: number = 1, pageSize = 50): ApiActionThunk {
  return async (dispatch, getState) => {
    // TODO (b5) - check state before making a network request
    return dispatch(fetchCollection(page, pageSize))
  }
}

// loadRunningCollection fetches all currently running workflow as WorkflowInfos
export function loadRunningCollection (): ApiActionThunk {
  return async (dispatch, getState) => {
    return dispatch(fetchRunningCollection())
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
      map: mapWorkflowInfo
    }
  }
}

function fetchRunningCollection (): ApiAction {
  return {
    type: 'running',
    [CALL_API]: {
      endpoint: 'collection/running',
      method: 'GET',
      map: mapWorkflowInfo
    }
  }
}

// workflowStarted is dispatched by the websocket and users should not need to
// dispatch it anywhere else
export function workflowStarted(workflow: Record<string, any>): WorkflowInfoAction {
  const wf = NewWorkflow(workflow)
  return {
    type: WORKFLOW_STARTED,
    data: workflowInfoFromWorkflow(wf)
  }
}

// workflowCompleted is dispatched by the websocket and users should not need to
// dispatch it anywhere else
export function workflowCompleted(workflow: Record<string, any>): WorkflowInfoAction {
  const wf = NewWorkflow(workflow)
  return {
    type: WORKFLOW_COMPLETED,
    data: workflowInfoFromWorkflow(wf)
  }
}