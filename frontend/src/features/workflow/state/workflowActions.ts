import { EventLogLine } from '../../../qrimatic/eventLog'
import { Workflow, workflowScriptString } from '../../../qrimatic/workflow'
import { CALL_API, ApiActionThunk } from '../../../store/api'
import { 
  WORKFLOW_CHANGE_STEP,
  RUN_EVENT_LOG,
 } from './workflowState'


export interface WorkflowAction {
  type: string
  index: number
  value: string
}

export function changeWorkflowStep(index: number, value: string): WorkflowAction {
  return {
    type: WORKFLOW_CHANGE_STEP,
    index,
    value,
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
            syntax: 'starlark',
            scriptBytes: btoa(workflowScriptString(w)),
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