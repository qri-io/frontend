import { createReducer } from '@reduxjs/toolkit'

import { RootState } from '../../../store/store'
import { DeployStatus, Workflow, workflowDeployStatus } from '../../../qrimatic/workflow'
import { DeployEventAction, ResetRunIdAction } from '../../deploy/state/deployActions'
import { QriRef } from '../../../qri/ref'

export const DEPLOY_START = 'DEPLOY_START'
export const DEPLOY_END = 'DEPLOY_END'
export const DEPLOY_SAVEWORKFLOW_START = 'DEPLOY_SAVEWORKFLOW_START'
export const DEPLOY_SAVEWORKFLOW_END = 'DEPLOY_SAVEWORKFLOW_END'
export const DEPLOY_SAVEDATASET_START = 'DEPLOY_SAVEDATASET_START'
export const DEPLOY_SAVEDATASET_END = 'DEPLOY_SAVEDATASET_END'
export const DEPLOY_RESET_RUN_ID = 'DEPLOY_RESET_RUN_ID'

export function newDeployStatusSelector (workflowID: string): (state: RootState) => DeployStatus {
  return (state: RootState): DeployStatus => (state.deploy.status[workflowID] || 'undeployed')
}

export function selectAllDeployStatuses (): (state: RootState) => Record<string, DeployStatus> {
  return (state: RootState): Record<string, DeployStatus> => (state.deploy.status)
}

export function selectDeployStatus (qriRef: QriRef): (state: RootState) => DeployStatus {
  return (state: RootState): DeployStatus => (state.deploy.status[`${qriRef.username}/${qriRef.name}`])
}

export const selectDeployRunId = (state: RootState): string => {
  return state.deploy.runId
}

export interface DeployState {
  status: Record<string, DeployStatus>
  runId: string // runID of deploying dataset, empty string means no deploying run
}

const initialState: DeployState = {
  status: {},
  runId: ''
}

const handleDeployEvents = (state: DeployState, action: DeployEventAction) => {
  if (action.data.error) {
    state.status[action.sessionID] = 'failed'
  }
}

export const deployReducer = createReducer(initialState, {
  // set deployStatus for this sessionID to 'deploying'
  DEPLOY_START: (state: DeployState, action: DeployEventAction) => {
    if (action.data.error) {
      state.status[action.sessionID] = 'failed'
      return
    }
    state.runId = action.data.runID
    state.status[action.sessionID] = 'deploying'
  },
  // set deployStatus for this sessionID to 'deployed'
  DEPLOY_END: (state: DeployState, action: DeployEventAction) => {
    if (action.data.error) {
      state.status[action.sessionID] = 'failed'
      return
    }
    state.status[action.sessionID] = 'deployed'
  },
  DEPLOY_SAVEWORKFLOW_START: handleDeployEvents,
  DEPLOY_SAVEWORKFLOW_END: handleDeployEvents,
  DEPLOY_SAVEDATASET_START: handleDeployEvents,
  DEPLOY_SAVEDATASET_END: handleDeployEvents,

  // on successful workflow fetch, derive deploy state
  'API_WORKFLOW_SUCCESS': (state: DeployState, action) => {
    const w = action.payload.data as Workflow
    state.status[w.id] = workflowDeployStatus(w)
  },
  'API_DEPLOY_FAILURE': (state: DeployState, action) => {
    const refString = action.payload.requestID
    state.status[refString] = 'failed'
  },
  DEPLOY_RESET_RUN_ID: (state: DeployState, action: ResetRunIdAction) => {
    state.runId = ''
  }
})
