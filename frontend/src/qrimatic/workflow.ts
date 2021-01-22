

export interface Workflow {
  // id of the workflow
  id: string
  // init id of the dataset
  datasetID?: string
  ownerID?: string
  created?: string
  name: string
  runCount: number

  triggers?: WorkflowTrigger[]
  steps?: TransformStep[]
  onCompletion?: WorkflowHook[]
}

export function NewWorkflow(data: Record<string,any>): Workflow {
  return {
    // TODO (ramfox): where/when do we get an id?
    id: data.id || 'temp_id',
    datasetID: data.datasetID,
    ownerID: data.ownerID,
    name: data.name,
    created: data.created,
    runCount: data.runCount || 0,
    
    triggers: data.triggers && data.triggers.map(NewWorkflowTrigger),
    steps: data.steps && data.steps.map(NewTransformStep),
    onCompletion: data.onCompletion && data.onCompletion.map(NewWorkflowHook),
  }
}

export interface WorkflowTrigger {
  id:         string,
  workflowId: string,
  type:       string,
  disabled?:   boolean,

	runCount?:      number,
	lastRunID?:     string,
	lastRunStart?:  string,
  lastRunStatus?: string,
  [key: string]: any
}

export function NewWorkflowTrigger(data: Record<string,any>): WorkflowTrigger {
  return {
    id: data.id || '',
    workflowId: data.workflowId || '',
    type: data.type,
    disabled: data.disabled || false,
  }
}

export interface TransformStep {
  category: string
  name: string
  syntax: string
  script: string
}

export function NewTransformStep(data: Record<string,any>): TransformStep {
  return {
    name: data.name,
    syntax: data.syntax,
    category: data.category,
    script: data.script
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
    if (step.syntax === 'starlark') {
      return str + `${step.script}\n`
    }
    return str
  }, '')
}