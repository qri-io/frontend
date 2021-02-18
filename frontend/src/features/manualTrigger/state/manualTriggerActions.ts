import { ApiAction, CALL_API } from "../../../store/api"

export function manualTriggerWorkflow(workflowID: string): ApiAction {
  return {
    type: 'manual_trigger',
    [CALL_API]: {
      endpoint: `workflows/trigger?id=${workflowID}`,
      method: 'POST',
      map: (data: object | []): any => {
        return data
      },
    }
  }
}