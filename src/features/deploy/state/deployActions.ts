import { CALL_API, ApiActionThunk} from '../../../store/api'
import { NewWorkflow, Workflow, workflowInfoFromWorkflow, workflowScriptString } from '../../../qrimatic/workflow'
import { WorkflowInfoAction } from '../../workflow/state/workflowActions'
import { DEPLOY_START, DEPLOY_STOP } from './deployState'

// const deployParams = {
//   "apply": true,
//   "workflow": {
//     "deployed": true,
//     "triggers": [
//       {"type": "cron", "enabled": true, "periodicity": "R/PT1D" }
//     ]
//   },
//   "ref": "me/example_one",
//   "dataset": {
//     "transform" : {
//       "steps": [
//         {
//           "name": "transform",
//           "syntax": "starlark",
//           "category": "transform",
//           "script": "def transform(ds, ctx):\n  ds.set_body([[1,2,3], [4,5,6], [7,8,9]])"
//         }
//       ]
//     }
//   }
// }

export function deployWorkflow(w: Workflow): ApiActionThunk {
  return async (dispatch, getState) => {
    return dispatch({
      type: 'deploy',

      [CALL_API]: {
        endpoint: '/auto/deploy',
        method: 'POST',
        body: {
          apply: true,
          workflow: w,
          // ref:
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
