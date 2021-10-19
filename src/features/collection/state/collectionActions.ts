import { ApiAction, CALL_API, ApiActionThunk } from "../../../store/api"
import { newVersionInfo, VersionInfo } from "../../../qri/versionInfo"
import { NewWorkflow, workflowInfoFromWorkflow } from "../../../qrimatic/workflow"
import { WORKFLOW_COMPLETED, WORKFLOW_STARTED } from "./collectionState"
import { AnyAction } from "redux"
import { RootState } from "../../../store/store";
import { ThunkDispatch } from 'redux-thunk'
import { QriRef } from '../../../qri/ref'


function mapVersionInfo (data: object | []): VersionInfo[] {
  if (!data) { return [] }
  return (data as []).map((data) => newVersionInfo(data))
}

export function loadCollection() {
  return async (dispatch, getState) => {
    return dispatch(fetchCollection())
  }
}

export function loadVersionInfo(initID: string) {
  return async (dispatch: ThunkDispatch<any, any, any>, getState: () => RootState) => {
    const state = getState();
    if (state.collection.collection[initID]) {
      return state.collection.collection[initID]
    } else if (!state.collection.pendingIDs.includes(initID)) {
      return dispatch(fetchVersionInfo(initID))
    } else return
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

function fetchVersionInfo (initID: string): ApiAction {
  return {
    type: 'versioninfo',
    [CALL_API]: {
      endpoint: 'collection/get',
      method: 'POST',
      body: {
        initID: initID
      },
    }
  }
}

// runnow will trigger a manual run.  On success, it will refresh the collection
export function runNow (qriRef: QriRef, initID: string): ApiActionThunk {
  return async (dispatch, getState) => {
    return dispatch(fetchRunNow(qriRef, initID))
  }
}

function fetchRunNow (qriRef: QriRef, initID: string): ApiAction {
  return {
    type: 'runnow_collection',
    qriRef,
    [CALL_API]: {
      endpoint: 'auto/run',
      method: 'POST',
      body: { ref: `${qriRef.username}/${qriRef.name}` },
      requestID: initID
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
