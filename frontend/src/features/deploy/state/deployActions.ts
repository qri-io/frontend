import { CALL_API, ApiActionThunk} from '../../../store/api'
import { NewWorkflow, Workflow, workflowInfoFromWorkflow, workflowScriptString } from '../../../qrimatic/workflow'
import { WorkflowInfoAction } from '../../workflow/state/workflowActions'
import { DEPLOY_START, DEPLOY_STOP } from './deployState'

export function deployWorkflow(w: Workflow): ApiActionThunk {
  return async (dispatch, getState) => {
    return dispatch({
      type: 'deploy',
      
      [CALL_API]: {
        endpoint: 'auto/deploy',
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

export function deployStarted(d: Record<string,any>): WorkflowInfoAction {
  const wf = NewWorkflow(d)
  return {
    type: DEPLOY_START,
    data: workflowInfoFromWorkflow(wf)
  }
}

export function deployStopped(d: Record<string,any>): WorkflowInfoAction {
  const wf = NewWorkflow(d)
  return {
    type: DEPLOY_STOP,
    data: workflowInfoFromWorkflow(wf)
  }
}