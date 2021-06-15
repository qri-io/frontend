import { createReducer } from '@reduxjs/toolkit'

import { RootState } from '../../../store/store';
import { DeployStatus, Workflow, workflowDeployStatus } from '../../../qrimatic/workflow';
import { WorkflowInfoAction } from '../../workflow/state/workflowActions';

export const DEPLOY_START = 'DEPLOY_START'
export const DEPLOY_STOP = 'DEPLOY_STOP'

export function newDeployStatusSelector(workflowID: string): (state: RootState) => DeployStatus {
  return (state: RootState): DeployStatus => (state.deploy.status[workflowID] || 'undeployed')
}

export interface DeployState {
  status: Record<string,DeployStatus>
}

const initialState: DeployState = {
  status: {}
}

export const deployReducer = createReducer(initialState, {
  DEPLOY_START: (state: DeployState, action: WorkflowInfoAction) => {
    state.status[action.data.id] = 'deploying'
  },
  DEPLOY_STOP: (state: DeployState, action: WorkflowInfoAction) => {
    // TODO(b5): we're assuming the deploy worked :/
    state.status[action.data.id] = 'deployed'
  },
  // on successful workflow fetch, derive deploy state
  'API_WORKFLOW_SUCCESS': (state: DeployState, action) => {
    const w = action.payload.data as Workflow
    state.status[w.id] = workflowDeployStatus(w)
  },
  // on successful deployment, derive deploy state
  'API_DEPLOY_SUCCESS': (state: DeployState, action) => {
    const w = action.payload.data.workflow as Workflow
    state.status[w.id] = workflowDeployStatus(w)
  },
})
