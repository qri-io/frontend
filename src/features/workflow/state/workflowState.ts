import { createReducer } from '@reduxjs/toolkit'
import DeepEqual from 'deep-equal'
import _ from 'lodash'

import { RootState } from '../../../store/store';
import { EventLogAction, SetWorkflowAction, SetWorkflowStepAction, SetWorkflowRefAction, WorkflowTriggerAction, RunModeAction } from './workflowActions';
import { NewRunFromEventLog, Run } from '../../../qri/run';
import { Workflow, WorkflowBase } from '../../../qrimatic/workflow';
import { EventLogLine } from '../../../qri/eventLog';
import Dataset from '../../../qri/dataset';
import { QriRef } from '../../../qri/ref';

export const RUN_EVENT_LOG = 'RUN_EVENT_LOG'
export const WORKFLOW_CHANGE_TRIGGER = 'WORKFLOW_CHANGE_TRIGGER'
export const WORKFLOW_CHANGE_TRANSFORM_STEP = 'WORKFLOW_CHANGE_TRANSFORM_STEP'
export const SET_WORKFLOW = 'SET_WORKFLOW'
export const SET_WORKFLOW_REF = 'SET_WORKFLOW_REF'
export const SET_RUN_MODE = 'SET_RUN_MODE'

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

export const selectRunsFromEventLog = (state: RootState): any => {
  const { events } = state.workflow
  const unique = [...new Set(events.map(d => d.sessionID))]
  return unique.map((d) => {
    return NewRunFromEventLog(d, events)
  })
}

export const selectWorkflow = (state: RootState): Workflow => state.workflow.workflow
export const selectWorkflowQriRef = (state: RootState): QriRef => state.workflow.qriRef
export const selectRunMode = (state: RootState): RunMode => state.workflow.runMode
export const selectWorkflowIsDirty = (state: RootState): boolean => state.workflow.isDirty


export type RunMode =
  | 'apply'
  | 'save'

export interface WorkflowState {
  runMode: RunMode
  // reference the workflow editor is manipulating
  qriRef?: QriRef
  workflow: Workflow
  workflowBase: WorkflowBase
  isDirty: boolean

  lastRunID?: string,
  events: EventLogLine[],
}

const initialState: WorkflowState = {
  runMode: 'apply',
  workflow: {
    id: '',
    ref:'',
    initID: 'fake_id',

    active: false,
    runCount: 0,
    status: 'unchanged',

    triggers: [],
    steps: [],
    hooks: []
  },
  workflowBase: {
    triggers: [],
    steps: [],
    hooks: []
  },
  isDirty: false,
  events: []
}

export const workflowReducer = createReducer(initialState, {
  'API_APPLY_SUCCESS': (state, action) => {
    const runID = action.payload.data.runID
    state.lastRunID = runID
  },
  SET_RUN_MODE: (state, action: RunModeAction) => {
    if (state.runMode !== action.mode) {
      state.events = [] // changing run modes negates any existing run state
      state.runMode = action.mode
    }
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
  'API_DATASETHEAD_SUCCESS': (state, action) => {
    const d = action.payload.data as Dataset
    // TODO (b5) - this should check peername *and* confirm the loaded version is HEAD
    if (state.qriRef?.name === d.name) {
      if (d.transform?.steps) {
        state.workflow.steps = d.transform.steps
        state.workflow.initID = d.path

        state.workflowBase.steps = d.transform.steps
      }
    }
  },
  'API_WORKFLOW_REQUEST': (state, action) => {
    // reset workflow and lastRunID to initialState values
    state.runMode = initialState.runMode
    // state.workflow = initialState.workflow
    state.lastRunID = undefined
  },
  'API_WORKFLOW_SUCCESS': (state, action) => {
    const w = action.payload.data as Workflow
    // TODO (b5) - right now we only use the single-workflow fetch endpoint in one
    // place (on the workflow editor), so there's no need to check if the ID of the
    // workflow we're editing matches the one coming from a successful API call,
    // but in the future we'll need to work out a way to only update on workflow
    // match, even when the dataset is fetched by qriRef. Two options:
    //   * modify the definintion of a workflow to always include this info
    // (basically *don't* switch datasetID to only be InitIDs in the future, always use full refs)
    //   * include the id we requested in the response action
    // Personally, I'm a fan of the latter
    // UPDATE: we're now passing the ref as a prop in workflow fetching actions
    // (see deploy reducer for an example usage), we should be able to add in this
    // ref check
    // const steps = state.workflow.steps
    state.workflow = {
      ...w,
      steps: state.workflow.steps
    }
    // state.workflow.steps = steps
  },
  'API_DEPLOY_SUCCESS': (state, action) => {
    state.isDirty = false
  }
})

function calculateIsDirty(state: WorkflowState) {
  const workflowCompare = {
    triggers: state.workflow.triggers,
    steps: state.workflow.steps,
    hooks: state.workflow.hooks
  }
  return !DeepEqual(workflowCompare, state.workflowBase)
}

function changeWorkflowTrigger(state: WorkflowState, action: WorkflowTriggerAction) {
  // TODO(chriswhong): allow for more than one trigger
  state.workflow.triggers = [action.trigger]
  return
}

function changeWorkflowTransformStep(state: WorkflowState, action: SetWorkflowStepAction) {
  if (state.workflow.steps) {
    state.workflow.steps[action.index].script = action.script
  }

  state.isDirty = calculateIsDirty(state)
  // clear out events after an edit to reset dry run RunStatus
  state.events = []



  return
}

function addRunEvent(state: WorkflowState, action: EventLogAction) {
  state.events.push(action.data)
  state.events.sort((a,b) => a.ts - b.ts)
}

function setWorkflow(state: WorkflowState, action: SetWorkflowAction) {
  state.workflow = action.workflow
  state.workflowBase = {
    triggers: action.workflow.triggers,
    steps: action.workflow.steps,
    hooks: action.workflow.hooks
  }
  state.events = []
  return
}
