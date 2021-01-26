import { RootState } from '../../../store/store';
import { createReducer } from '@reduxjs/toolkit'
import { EventLogAction, SetWorkflowAction, SetWorkflowStepAction } from './workflowActions';
import { NewRunFromEventLog, Run } from '../../../qrimatic/run';
import { Workflow } from '../../../qrimatic/workflow';
import { EventLogLine } from '../../../qrimatic/eventLog';

export const RUN_EVENT_LOG = 'RUN_EVENT_LOG'
export const WORKFLOW_CHANGE_STEP = 'WORKFLOW_CHANGE_STEP'
export const SET_WORKFLOW = 'SET_WORKFLOW'

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
      { id: '', workflowID: '', type: 'cron', value: 'R/PT1H' }
    ],
    steps: [
      { syntax: 'starlark', category: 'setup', name: 'setup', script: `# load_ds("b5/world_bank_population")` },
      { syntax: 'starlark', category: 'download', name: 'download', script: `def download(ctx):\n\treturn "your download here"` },
      { syntax: 'starlark', category: 'transform', name: 'transform', script: 'def transform(ds,ctx):\n\tds.set_body([[1,2,3],[4,5,6]])' },
      { syntax: 'save', category: 'save', name: 'save', script: '' }
    ],
    onComplete: [
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
  // temp action used to work around the api, auto sets the events
  // of the workflow without having to have a working api
  TEMP_SET_WORKFLOW_EVENTS: (state, action) => {
    state.events = action.events
    state.lastRunID = action.id
  },
  SET_WORKFLOW: setWorkflow,
  WORKFLOW_CHANGE_STEP: changeWorkflowStep,
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
