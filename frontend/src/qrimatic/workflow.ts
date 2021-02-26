import { NewTransformStep, TransformStep } from "../qri/dataset"
import { VersionInfo } from "../qri/versionInfo"

export type RunStatus =
  | 'running'
  | 'succeeded'
  | 'failed'
  | ''          // empty status indicates a manual change

export interface Workflow {
  id: string
  ownerID?: string
  datasetID?: string

  disabled: boolean
  runCount: number

  latestStart?: string
  latestEnd?: string
  status: WorkflowStatus
  
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

    latestStart: data.latestStart,
    latestEnd: data.latestEnd,
    status: data.status,

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

export type DeployStatus = 
  | 'undeployed'
  | 'deployed'
  | 'deploying'
  | 'drafting'
  | 'paused'

export function workflowDeployStatus(w?: Workflow): DeployStatus {
  if (!w) {
    return 'undeployed'
  } else if (w.id === '') {
    return 'undeployed'
  } else if (w.disabled) {
    return 'paused'
  }
  return 'deployed'
}

export type WorkflowStatus = 
| 'running'
| 'succeeded'
| 'failed'
| 'unchanged'

export interface WorkflowInfo extends VersionInfo {
  id: string
  latestStart?: string
  latestEnd?: string
  status: WorkflowStatus
}

export function datasetAliasFromWorkflowInfo(wfi: WorkflowInfo): string {
  return `${wfi.username}/${wfi.name}`
}

export function newWorkflowInfo(data: Record<string,any>): WorkflowInfo {
  return {
    username: data.username || '',
    profileId: data.profileId || '',
    name: data.name || '',
    path: data.path || '',
    
    fsiPath: data.fsiPath || '',
    foreign: data.foreign,
    published: data.published,

    metaTitle: data.metaTitle || '',
    themeList: data.themeList || '',

    bodyFormat: data.bodyFormat || '-',
    bodySize: data.bodySize,
    bodyRows: data.bodyRows,
    numErrors: data.numErrors,

    commitTitle: data.commitTitle,
    commitMessage: data.commitMessage,
    commitTime: data.commitTime,
    numVersions: data.numVersions,

    id: data.id,
    latestStart: data.latestStart,
    latestEnd: data.latestEnd,
    status: data.status
  }
}

export function workflowInfoFromWorkflow(wf: Workflow): WorkflowInfo {
  return {
    username: wf.versionInfo?.username || '',
    profileId: wf.versionInfo?.profileId || '',
    name: wf.versionInfo?.name || '',
    path: wf.versionInfo?.path || '',
    
    fsiPath: wf.versionInfo?.fsiPath || '',
    foreign: wf.versionInfo?.foreign,
    published: wf.versionInfo?.published,

    metaTitle: wf.versionInfo?.metaTitle || '',
    themeList: wf.versionInfo?.themeList || '',

    bodyFormat: wf.versionInfo?.bodyFormat || '-',
    bodySize: wf.versionInfo?.bodySize,
    bodyRows: wf.versionInfo?.bodyRows,
    numErrors: wf.versionInfo?.numErrors,

    commitTitle: wf.versionInfo?.commitTitle,
    commitMessage: wf.versionInfo?.commitMessage,
    commitTime: wf.versionInfo?.commitTime,
    numVersions: wf.versionInfo?.numVersions,

    id: wf.id,
    latestStart: wf.latestStart,
    latestEnd: wf.latestEnd,
    status: wf.status 
  }
}