import { CALL_API, ApiActionThunk} from '../../../store/api'
import { Workflow, workflowScriptString } from '../../../qrimatic/workflow'

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