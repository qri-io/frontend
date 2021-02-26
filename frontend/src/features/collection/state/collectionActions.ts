import { AnyAction } from "@reduxjs/toolkit"
import { NewWorkflow, newWorkflowInfo, WorkflowInfo, workflowInfoFromWorkflow } from "../../../qrimatic/workflow"
import { ApiAction, ApiActionThunk, CALL_API } from "../../../store/api"
import { WORKFLOW_COMPLETED, WORKFLOW_STARTED } from "./collectionState"

function mapWorkflowInfo (data: object | []): WorkflowInfo[] {
  return (data as []).map((data) => newWorkflowInfo(data))
}

export function loadCollection (page: number = 1, pageSize = 50): ApiActionThunk {
  return async (dispatch, getState) => {
    // TODO (b5) - check state before making a network request
    return dispatch(fetchCollection(page, pageSize))
  }
}

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

export interface WorkflowInfoAction extends AnyAction {
  type: string
  data: WorkflowInfo
}

export function workflowStarted(workflow: Record<string, any>): WorkflowInfoAction {
  const wf = NewWorkflow(workflow)
  return {
    type: WORKFLOW_STARTED,
    data: workflowInfoFromWorkflow(wf)
  }
}

export function workflowCompleted(workflow: Record<string, any>): WorkflowInfoAction {
  const wf = NewWorkflow(workflow)
  return {
    type: WORKFLOW_COMPLETED,
    data: workflowInfoFromWorkflow(wf)
  }
}