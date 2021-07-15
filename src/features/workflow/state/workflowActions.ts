import { QriRef } from '../../../qri/ref'
import { EventLogLine } from '../../../qri/eventLog'
import { NewWorkflow, Workflow, WorkflowInfo, workflowScriptString, WorkflowTrigger } from '../../../qrimatic/workflow'
import { CALL_API, ApiActionThunk, ApiAction } from '../../../store/api'
import {
  WORKFLOW_CHANGE_TRIGGER,
  WORKFLOW_CHANGE_TRANSFORM_STEP,
  RUN_EVENT_LOG,
  TEMP_SET_WORKFLOW_EVENTS,
  SET_WORKFLOW,
  SET_WORKFLOW_REF,
  SET_RUN_MODE,
  RunMode
} from './workflowState'
import { AnyAction } from 'redux'

export function mapWorkflow(d: object | []): Workflow {
  const data = (d as Record<string,any>)
  const wf = data.workflow || {}
  wf.steps = data.dataset?.transform?.steps
  wf.ref = data.ref

  return NewWorkflow(wf)
}

export function loadWorkflowByDatasetRef(qriRef: QriRef): ApiActionThunk {
  return async (dispatch, getState) => {
    return dispatch(fetchWorkflowByDatasetRef(qriRef))
  }
}

function fetchWorkflowByDatasetRef(qriRef: QriRef): ApiAction {
  return {
    type: 'workflow',
    qriRef,
    [CALL_API]: {
      endpoint: 'auto/workflow',
      method: 'POST',
      body: { ref: `${qriRef.username}/${qriRef.name}` },
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
  mode: RunMode
}

export function setRunMode(mode: RunMode): RunModeAction {
  return {
    type: SET_RUN_MODE,
    mode,
  }
}

export function applyWorkflowTransform(w: Workflow): ApiActionThunk {
  return async (dispatch, getState) => {
    return dispatch({
      type: 'apply',
      [CALL_API]: {
        endpoint: 'auto/apply',
        method: 'POST',
        body: {
          wait: false,
          transform: {
            scriptBytes: btoa(workflowScriptString(w)),
            steps: w.steps
          }
        },
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

export interface WorkflowInfoAction extends AnyAction {
  type: string
  data: WorkflowInfo
}
