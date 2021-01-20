import { EventLogLine } from '../../../qrimatic/eventLog'
import { Workflow, workflowScriptString } from '../../../qrimatic/workflow'
import { CALL_API, ApiActionThunk } from '../../../store/api'
import { 
  WORKFLOW_CHANGE_STEP,
  WORKFLOW_RENAME_DATASET,
  RUN_EVENT_LOG,
  TEMP_SET_WORKFLOW_EVENTS,
  SET_WORKFLOW
 } from './workflowState'


export interface SetWorkflowStepAction {
  type: string
  index: number
  script: string
}

export function changeTransformStep(index: number, script: string): SetWorkflowStepAction {
  return {
    type: WORKFLOW_CHANGE_STEP,
    index,
    script,
  }
}

export interface RenameDatasetAction {
  type: string,
  name: string
}

export function changeDatasetName(name: string): RenameDatasetAction {
  return {
    type: WORKFLOW_RENAME_DATASET,
    name,
  }
}

export function runWorkflow(w: Workflow): ApiActionThunk {
  return async (dispatch, getState) => {
    return dispatch({
      type: 'run_workflow',
      [CALL_API]: {
        endpoint: 'apply',
        method: 'POST',
        body: {
          transform: {
            scriptBytes: btoa(workflowScriptString(w)),
            steps: w.steps
          }
        },
      }
    })
  }
}

export function deployWorkflow(w: Workflow): ApiActionThunk {
  return async (dispatch, getState) => {
    return dispatch({
      type: 'deploy',
      [CALL_API]: {
        endpoint: 'deploy',
        method: 'POST',
        body: {
          apply: true,
          workflow: w,
          transform: {
            scriptBytes: btoa(workflowScriptString(w)),
            steps: w.steps
          }
        }
      }
    })
  }
}

export interface EventLogAction {
  type: string
  data: EventLogLine
}

export function runEventLog(event: EventLogLine): EventLogAction {
  return {
    type: RUN_EVENT_LOG,
    data: event,
  }
}

export interface SetWorkflowAction {
  type: string
  workflow: Workflow
}

export function setWorkflow(workflow: Workflow): SetWorkflowAction {
  return {
    type: SET_WORKFLOW,
    workflow
  }
}

// temp action used to work around the api, auto sets the events
// of the workflow without having to have a working api
export interface TempWorkflowAction {
  type: string,
  id: string,
  events: EventLogLine[]
}

// temp action used to work around the api, auto sets the events
// of the workflow without having to have a working api
export function tempSetWorkflowEvents(id: string, events: EventLogLine[]): TempWorkflowAction {
  return {
    type: TEMP_SET_WORKFLOW_EVENTS,
    id,
    events
  }
}