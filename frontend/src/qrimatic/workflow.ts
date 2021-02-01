import { NewTransformStep, TransformStep } from "../qri/dataset"
import { VersionInfo } from "../qri/versionInfo"


export interface Workflow {
  id: string
  ownerID?: string
  datasetID?: string

  disabled: boolean
  runCount: number
  latestRunStart?: string
  
  triggers?: WorkflowTrigger[]
  steps?: TransformStep[]
  onComplete?: WorkflowHook[]

  versionInfo?: VersionInfo
}

export function NewWorkflow(data: Record<string,any>): Workflow {
  return {
    id: data.id || '',
    datasetID: data.datasetID,
    ownerID: data.ownerID,

    disabled: data.disabled || false,
    runCount: data.runCount || 0,
    latestRunStart: data.latestRunStart,

    triggers: data.triggers && data.triggers.map(NewWorkflowTrigger),
    steps: data.steps && data.steps.map(NewTransformStep),
    onComplete: data.onComplete && data.onComplete.map(NewWorkflowHook),

    versionInfo: data.versionInfo
  }
}

export interface WorkflowTrigger {
  id:         string,
  workflowID: string,
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
    workflowID: data.workflowID || '',
    type: data.type,
    disabled: data.disabled || false,
  }
}

export interface WorkflowHook {
  type: string
  value?: string | Record<string,any>
  [key: string]: any
}

export function NewWorkflowHook(data: Record<string,any>): WorkflowHook {
  return {
    type: data.type,
    value: data.value,
    remote: data.remote
  }
}

export function workflowScriptString(w: Workflow): string {
  if (!w.steps) { 
    return ''
  }

  return w.steps.reduce((str, step) => {
    if (step.category === 'starlark') {
      return str + `${step.script}\n`
    }
    return str
  }, '')
}