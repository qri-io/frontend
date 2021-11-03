import { NewWorkflow, Workflow } from "../../../qrimatic/workflow"
import { prepareTriggersForDeploy } from "../../trigger/util"

export function prepareWorkflowForDeploy (w: Workflow): Workflow {
  const wf = NewWorkflow(w)
  wf.triggers = prepareTriggersForDeploy(w.triggers)
  return wf
}
