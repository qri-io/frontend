

export interface Workflow {
  triggers?: WorkflowTrigger[]
  datasetID?: string
  steps?: WorkflowStep[]
  onCompletion?: WorkflowHook[]
}

export function NewWorkflow(data: Record<string,any>): Workflow {
  return {
    datasetID: data.datasetID,
    triggers: data.triggers && data.triggers.map(NewWorkflowTrigger),
    steps: data.steps && data.steps.map(NewWorkflowStep),
    onCompletion: data.onCompletion && data.onCompletion.map(NewWorkflowHook),
  }
}

export interface WorkflowTrigger {
  type: string
  value: string | Record<string,any>
}

export function NewWorkflowTrigger(data: Record<string,any>): WorkflowTrigger {
  return {
    type: data.type,
    value: data.value
  }
}

export interface WorkflowStep {
  type: string
  name: string
  value: string
}

export function NewWorkflowStep(data: Record<string,any>): WorkflowStep {
  return {
    type: data.type,
    name: data.name,
    value: data.value
  }
}

export interface WorkflowHook {
  type: string
  value: string | Record<string,any>
}

export function NewWorkflowHook(data: Record<string,any>): WorkflowHook {
  return {
    type: data.type,
    value: data.value
  }
}