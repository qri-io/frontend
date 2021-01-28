import { createReducer } from '@reduxjs/toolkit'

import { RootState } from '../../../store/store';
import { EventLogAction, SetWorkflowAction, SetWorkflowStepAction, SetWorkflowRefAction, WorkflowTriggerAction } from './workflowActions';
import { NewRunFromEventLog, Run } from '../../../qrimatic/run';
import { Workflow } from '../../../qrimatic/workflow';
import { EventLogLine } from '../../../qri/eventLog';
import Dataset from '../../../qri/dataset';
import { QriRef } from '../../../qri/ref';

export const RUN_EVENT_LOG = 'RUN_EVENT_LOG'
export const WORKFLOW_CHANGE_TRIGGER = 'WORKFLOW_CHANGE_TRIGGER'
export const WORKFLOW_CHANGE_TRANSFORM_STEP = 'WORKFLOW_CHANGE_TRANSFORM_STEP'
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
  // reference the workflow editor is manipulating
  qriRef?: QriRef,
  workflow: Workflow,

  lastRunID?: string,
  events: EventLogLine[],
}

const initialState: WorkflowState = {
  workflow: {
    id: '',
    datasetID: 'fake_id',
    runCount: 0,
    disabled: false,

    triggers: [
      { id: '', workflowID: '', type: 'cron', periodicity: 'R/PT1H' }
    ],
    steps: [
      { syntax: 'starlark', category: 'setup', name: 'setup', script: `# load_ds("b5/world_bank_population")` },
      { syntax: 'starlark', category: 'download', name: 'download', script: `def download(ctx):\n\treturn "your download here"` },
      { syntax: 'starlark', category: 'transform', name: 'transform', script: 'def transform(ds,ctx):\n\tds.set_body([[1,2,3],[4,5,6]])' },
      { syntax: 'save', category: 'save', name: 'save', script: '' }
    ],
    onComplete: [
      { type: 'push', remote: 'https://registry.qri.cloud' },
    ]
  },
  events: []
}

export const workflowReducer = createReducer(initialState, {
  'API_RUN_WORKFLOW_SUCCESS': (state, action) => {
    const runID = action.payload.data.runID
    state.lastRunID = runID
  },
  // temp action used to work around the api, auto sets the events
  // of the workflow without having to have a working api
  TEMP_SET_WORKFLOW_EVENTS: (state, action) => {
    state.events = action.events
    state.lastRunID = action.id
  },
  SET_WORKFLOW: setWorkflow,
  WORKFLOW_CHANGE_TRIGGER: changeWorkflowTrigger,
  WORKFLOW_CHANGE_TRANSFORM_STEP: changeWorkflowTransformStep,
  RUN_EVENT_LOG: addRunEvent,
  SET_WORKFLOW_REF: (state, action: SetWorkflowRefAction) => {
    state.qriRef = action.qriRef
    state.workflow.datasetID = `${action.qriRef.username}/${action.qriRef.name}`
  },
  // listen for dataset fetching actions, if the reference of the fetched dataset
  // matches the ref the workbench reducer is tuned to, load the transform script
  // into the workbench
  'API_DATASET_SUCCESS': (state, action) => {
    const d = action.payload.data as Dataset
    // TODO (b5) - this should check peername *and* confirm the loaded version is HEAD
    if (state.qriRef?.name === d.name) {
      if (d.transform?.steps) {
        state.workflow.steps = d.transform.steps
      }
    }
  },
})

function changeWorkflowTrigger(state: WorkflowState, action: WorkflowTriggerAction) {
  if (state.workflow.triggers && state.workflow.triggers.length > action.index) {
    state.workflow.triggers[action.index] = action.trigger
  }
  return
}

function changeWorkflowTransformStep(state: WorkflowState, action: SetWorkflowStepAction) {
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
