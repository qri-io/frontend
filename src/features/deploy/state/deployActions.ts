import { CALL_API, ApiActionThunk} from '../../../store/api'
import { QriRef, refStringFromQriRef } from '../../../qri/ref'
import { Workflow, workflowScriptString } from '../../../qrimatic/workflow'
import { Dataset } from '../../../qri/dataset'
import {
  DEPLOY_START,
  DEPLOY_END,
  DEPLOY_SAVEWORKFLOW_START,
  DEPLOY_SAVEWORKFLOW_END,
  DEPLOY_SAVEDATASET_START,
  DEPLOY_SAVEDATASET_END,
} from './deployState'

export interface DeployEvent {
  datasetID: string
  error: string
  ref: string
  runID: string
  workflowID: string
}

export interface DeployEventAction {
  type: string
  data: DeployEvent
  sessionID: string
}

export function deployWorkflow(qriRef: QriRef, w: Workflow, d: Dataset, run: boolean): ApiActionThunk {
  // this is where we strip the steps from the workflow and add them to dataset
  return async (dispatch, getState) => {
    return dispatch({
      type: 'deploy',
      [CALL_API]: {
        endpoint: 'auto/deploy',
        method: 'POST',
        requestID: refStringFromQriRef(qriRef),
        body: {
          run,
          workflow: w,
          dataset: {
            peername: qriRef.username,
            name: qriRef.name,
            transform: {
              scriptBytes: btoa(workflowScriptString(w)),
              steps: d.transform.steps
            }
          }
        },
      }
    })
  }
}

export function deployStarted(data: DeployEvent, sessionID: string): DeployEventAction {
  return {
    type: DEPLOY_START,
    data,
    sessionID
  }
}

export function deployEnded(data: DeployEvent, sessionID: string): DeployEventAction {
  return {
    type: DEPLOY_END,
    data,
    sessionID
  }
}

export function deploySaveWorkflowStarted(data: DeployEvent, sessionID: string): DeployEventAction {
  return {
    type: DEPLOY_SAVEWORKFLOW_START,
    data,
    sessionID
  }
}

export function deploySaveWorkflowEnded(data: DeployEvent, sessionID: string): DeployEventAction {
  return {
    type: DEPLOY_SAVEWORKFLOW_END,
    data,
    sessionID
  }
}

export function deploySaveDatasetStarted(data: DeployEvent, sessionID: string): DeployEventAction {
  return {
    type: DEPLOY_SAVEDATASET_START,
    data,
    sessionID
  }
}

export function deploySaveDatasetEnded(data: DeployEvent, sessionID: string): DeployEventAction {
  return {
    type: DEPLOY_SAVEDATASET_END,
    data,
    sessionID
  }
}
