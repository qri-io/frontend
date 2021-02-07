import { createReducer } from '@reduxjs/toolkit'

import { RootState } from '../../../store/store';
import { DeployStatus, Workflow, workflowDeployStatus } from '../../../qrimatic/workflow';

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
  // on successful workflow fetch, derive deploy state
  'API_WORKFLOW_SUCCESS': (state: DeployState, action) => {
    const w = action.payload.data as Workflow
    state.status[w.id] = workflowDeployStatus(w)
  }

})
