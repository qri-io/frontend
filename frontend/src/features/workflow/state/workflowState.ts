import { RootState } from '../../../store/store';
import { createReducer } from '@reduxjs/toolkit'
import { EventLogAction, WorkflowAction } from './workflowActions';
import { NewRunFromEventLog, Run } from '../../../qrimatic/run';
import { NewWorkflow, Workflow } from '../../../qrimatic/workflow';
import { EventLogLine } from '../../../qrimatic/eventLog';

export const RUN_EVENT_LOG = 'RUN_EVENT_LOG'
export const WORKFLOW_CHANGE_STEP = 'WORKFLOW_CHANGE_STEP'

// temp action used to work around the api, auto sets the events
// of the workflow without having to have a working api
export const TEMP_SET_WORKFLOW_EVENTS = 'TEMP_SET_WORKFLOW_EVENTS'

export const selectLatestRun = (state: RootState): Run | undefined => {
  if (state.workflow.lastRunID) {
    console.log('calculating event log for id', state.workflow.lastRunID, 'from events', state.workflow.events, NewRunFromEventLog(state.workflow.lastRunID, state.workflow.events))
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
  workflow: NewWorkflow({
    datasetID: 'fake_id',
    triggers: [
      { type: 'cron', value: 'R/PT1H' }
    ],
    steps: [
      { type: 'starlark', name: 'setup', value: `# load_ds("b5/world_bank_population")` },
      { type: 'starlark', name: 'download', value: `def download(ctx):\n\treturn "your download here"` },
      { type: 'starlark', name: 'transform', value: 'def transform(ds,ctx):\n\tds.set_body([[1,2,3],[4,5,6]])' },
      { type: 'save', name: 'save', value: '' }
    ],
    onCompletion: [
      { type: 'push', value: 'https://registry.qri.cloud' },
    ]
  }),
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
  WORKFLOW_CHANGE_STEP: changeWorkflowStep,
  RUN_EVENT_LOG: addRunEvent,
})

function changeWorkflowStep(state: WorkflowState, action: WorkflowAction) {
  if (state.workflow.steps) {
    state.workflow.steps[action.index].value = action.value
  }
  return
}

function addRunEvent(state: WorkflowState, action: EventLogAction) {
  state.events.push(action.data)
  state.events.sort((a,b) => a.ts - b.ts)
}