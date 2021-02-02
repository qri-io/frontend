import { QriRef } from '../../../qri/ref'
import { EventLogLine } from '../../../qri/eventLog'
import { NewWorkflow, Workflow, workflowScriptString, WorkflowTrigger } from '../../../qrimatic/workflow'
import { CALL_API, ApiActionThunk, ApiAction } from '../../../store/api'
import { 
  WORKFLOW_CHANGE_TRIGGER,
  WORKFLOW_CHANGE_TRANSFORM_STEP,
  RUN_EVENT_LOG,
  TEMP_SET_WORKFLOW_EVENTS,
  SET_WORKFLOW,
  SET_WORKFLOW_REF,
  SET_RUN_MODE
} from './workflowState'

export function mapWorkflow(d: object | []): Workflow {
  return NewWorkflow((d as Record<string,any>))
}

 export function loadWorkflowByDatasetRef(ref: QriRef): ApiActionThunk {
  return async (dispatch, getState) => {
    return dispatch(fetchWorkflow(ref))
  }
}

function fetchWorkflow(ref: QriRef): ApiAction {
  return {
    type: 'workflow',
    [CALL_API]: {
      endpoint: `workflow?dataset_id=${ref.username}/${ref.name}`,
      method: 'GET',
      map: mapWorkflow
    }
  }
}


export interface SetWorkflowStepAction {
  type: string
  index: number
  script: string
}

export function changeWorkflowTransformStep(index: number, script: string): SetWorkflowStepAction {
  return {
    type: WORKFLOW_CHANGE_TRANSFORM_STEP,
    index,
    script,
  }
}

export interface WorkflowTriggerAction {
  type: string
  index: number,
  trigger: WorkflowTrigger
}

export function changeWorkflowTrigger(index: number, trigger: WorkflowTrigger): WorkflowTriggerAction {
  return {
    type: WORKFLOW_CHANGE_TRIGGER,
    index,
    trigger
  }
}

export interface RunModeAction {
  type: string
  mode: 'apply' | 'save'
}

export function setRunMode(mode: 'apply' | 'save'): RunModeAction {
  return {
    type: SET_RUN_MODE,
    mode,
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

export interface SetWorkflowRefAction {
  type: string
  qriRef: QriRef
}

 export function setWorkflowRef(qriRef: QriRef): SetWorkflowRefAction {
  return {
    type: SET_WORKFLOW_REF,
    qriRef,
  }
}