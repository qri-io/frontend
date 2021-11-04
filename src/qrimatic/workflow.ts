import { TransformStep } from "../qri/dataset"
import { VersionInfo } from "../qri/versionInfo"

export type RunStatus =
  | 'running'
  | 'succeeded'
  | 'failed'
  | '' // empty status indicates a manual change

export interface Workflow {
  id: string
  initID?: string
  ownerID?: string
  created?: string
  active: boolean
  triggers?: Array<(WorkflowTrigger | CronTrigger)>
  hooks?: WorkflowHook[]
  steps?: TransformStep[]
  disabled?: boolean
}

// stores only the things we need to track to compute dirty/drafting state
export interface WorkflowBase {
  triggers?: WorkflowTrigger[]
  steps?: TransformStep[]
  hooks?: WorkflowHook[]
}

export function NewWorkflow (data: Record<string, any>): Workflow {
  return {
    id: data.id || '',
    initID: data.initID,
    ownerID: data.ownerID,
    created: data.created,
    active: data.active,
    triggers: data.triggers && data.triggers.map(NewWorkflowTrigger),
    hooks: data.hooks && data.hooks.map(NewWorkflowHook)
  }
}

export type WorkflowTriggerType = 'cron' | 'webhook' | 'dataset'

export interface CronTrigger extends WorkflowTrigger {
  periodicity: string // ISO8601 repeating interval (R/{starttime}/{interval})
}

export interface WorkflowTrigger {
  active?: boolean
  type: WorkflowTriggerType
}

export function NewWorkflowTrigger (data: Record<string, any>): WorkflowTrigger {
  return {
    active: data.active || true,
    type: data.type,
    ...data
  }
}

export interface WorkflowHook {
  type: string
  value?: string | Record<string, any>
  [key: string]: any
}

export function NewWorkflowHook (data: Record<string, any>): WorkflowHook {
  return {
    type: data.type,
    value: data.value,
    remote: data.remote
  }
}

export function workflowScriptString (w: Workflow): string {
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
  | 'failed'

export function workflowDeployStatus (w?: Workflow): DeployStatus {
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

export function datasetAliasFromWorkflowInfo (wfi: WorkflowInfo): string {
  return `${wfi.username}/${wfi.name}`
}

export function newWorkflowInfo (data: Record<string, any>): WorkflowInfo {
  return {
    initID: data.initID,
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
    status: data.status,

    runCount: data.runCount,
    commitCount: data.commitCount,
    downloadCount: data.downloadCount,
    followerCount: data.followerCount,
    openIssueCount: data.openIssueCount
  }
}
