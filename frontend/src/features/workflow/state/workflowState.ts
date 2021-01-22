import { createReducer } from '@reduxjs/toolkit'

import { RootState } from '../../../store/store';
import { EventLogAction, RenameDatasetAction, SetWorkflowAction, SetWorkflowRefAction, SetWorkflowStepAction } from './workflowActions';
import { NewRunFromEventLog, Run } from '../../../qrimatic/run';
import { Workflow } from '../../../qrimatic/workflow';
import { EventLogLine } from '../../../qrimatic/eventLog';
import { QriRef } from '../../../qri/ref';
import Dataset from '../../../qri/dataset';

export const RUN_EVENT_LOG = 'RUN_EVENT_LOG'
export const WORKFLOW_CHANGE_STEP = 'WORKFLOW_CHANGE_STEP'
export const WORKFLOW_RENAME_DATASET = 'WORKFLOW_RENAME_DATASET'
export const SET_WORKFLOW = 'SET_WORKFLOW'
export const SET_WORKFLOW_REF = 'SET_WORKFLOW_REF'

// temp action used to work around the api, auto sets the events
// of the workflow without having to have a working api
export const TEMP_SET_WORKFLOW_EVENTS = 'TEMP_SET_WORKFLOW_EVENTS'

export const selectLatestRun = (state: RootState): Run | undefined => {
  if (state.workflow.lastRunID) {
    // console.log('calculating event log for id', state.workflow.lastRunID, 'from events', state.workflow.events, NewRunFromEventLog(state.workflow.lastRunID, state.workflow.events))
    return NewRunFromEventLog(state.workflow.lastRunID, state.workflow.events)
  }
  return undefined
}

export const selectWorkflow = (state: RootState): Workflow => state.workflow.workflow

export interface WorkflowState {
  qriRef?: QriRef
  workflow: Workflow,

  lastRunID?: string,
  events: EventLogLine[],
}

const initialState: WorkflowState = {
  workflow: {
    id: '',
    datasetID: '',
    name: '',
    runCount: 0,
    triggers: [
      { id: '', workflowId: '', type: 'cron', periodicity: 'R/PT1H' }
    ],
    steps: [
      { syntax: 'starlark', name: 'setup', category: 'setup', script: `` },
      { syntax: 'starlark', name: 'download', category: 'download', script: `` },
      { syntax: 'starlark', name: 'transform', category: 'transform', script: '' },
      { syntax: 'save', name: 'save', category: 'save', script: '' }
    ],
    onCompletion: [
      { type: 'push', value: 'https://registry.qri.cloud' },
    ]
  },
  events: []
}

export const workflowReducer = createReducer(initialState, {
  'API_RUN_WORKFLOW_SUCCESS': (state, action) => {
    const runID = action.payload.data.runID
    state.lastRunID = runID
  },
  'API_LOAD_WORKFLOW_SUCCESS': (state, action) => {
    console.log('loaded workflow', action)
  },
  'API_DATASET_SUCCESS': (state, action) => {
    const d = action.payload.data as Dataset
    // TODO (b5) - this should check peername *and* confirm the loaded verison is HEAD
    if (state.qriRef?.name === d.name) {
      if (d.transform?.steps) {
        state.workflow.steps = d.transform.steps
      }
    }
  },
  SET_WORKFLOW_REF: (state, action: SetWorkflowRefAction) => {
    state.qriRef = action.qriRef
    state.workflow.datasetID = `${action.qriRef.username}/${action.qriRef.name}`
  },
  // temp action used to work around the api, auto sets the events
  // of the workflow without having to have a working api
  TEMP_SET_WORKFLOW_EVENTS: (state, action) => {
    state.events = action.events
    state.lastRunID = action.id
  },
  SET_WORKFLOW: setWorkflow,
  WORKFLOW_CHANGE_STEP: changeWorkflowStep,
  WORKFLOW_RENAME_DATASET: (state: WorkflowState, action: RenameDatasetAction) => {
    state.workflow.name = action.name
  },
  RUN_EVENT_LOG: addRunEvent,
})

function changeWorkflowStep(state: WorkflowState, action: SetWorkflowStepAction) {
  if (state.workflow.steps) {
    state.workflow.steps[action.index].script = action.script
  }
  return
}

function addRunEvent(state: WorkflowState, action: EventLogAction) {
  state.events.push(action.data)
  state.events.sort((a,b) => a.ts - b.ts)
}

function setWorkflow(state: WorkflowState, action: SetWorkflowAction) {
  state.workflow = action.workflow
  state.events = []
  return
}