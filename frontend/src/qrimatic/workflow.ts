

export interface Workflow {
  // id of the workflow
  id: string
  // init id of the dataset
  datasetID?: string
  triggers?: WorkflowTrigger[]
  steps?: WorkflowStep[]
  onCompletion?: WorkflowHook[]
}

export function NewWorkflow(data: Record<string,any>): Workflow {
  return {
    // TODO (ramfox): where/when do we get an id?
    id: data.id || 'temp_id',
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
  syntax: string
  value: string
}

export function NewWorkflowStep(data: Record<string,any>): WorkflowStep {
  return {
    type: data.type,
    name: data.name,
    syntax: data.syntax,
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

export function workflowScriptString(w: Workflow): string {
  if (!w.steps) { 
    return ''
  }

  return w.steps.reduce((str, step) => {
    if (step.type === 'starlark') {
      return str + `${step.value}\n`
    }
    return str
  }, '')
}