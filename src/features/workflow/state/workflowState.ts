import { createReducer } from '@reduxjs/toolkit'
import DeepEqual from 'deep-equal'

import { RootState } from '../../../store/store'
import {
  SetWorkflowStepAction,
  SetWorkflowRefAction,
  WorkflowTriggerAction,
  RunModeAction,
  SetTemplateAction,
  AddWorkflowStepAction,
  WorkflowStepAction,
  UndoWorkflowChanges
} from './workflowActions'
import { Workflow, WorkflowBase } from '../../../qrimatic/workflow'
import { Dataset, NewDataset, qriRefFromDataset } from '../../../qri/dataset'
import { QriRef } from '../../../qri/ref'

export const WORKFLOW_CHANGE_TRIGGER = 'WORKFLOW_CHANGE_TRIGGER'
export const WORKFLOW_DELETE_TRIGGER = 'WORKFLOW_DELETE_TRIGGER'
export const WORKFLOW_CHANGE_TRANSFORM_STEP = 'WORKFLOW_CHANGE_TRANSFORM_STEP'
export const WORKFLOW_ADD_TRANSFORM_STEP = 'WORKFLOW_ADD_TRANSFORM_STEP'
export const WORKFLOW_REMOVE_TRANSFORM_STEP = 'WORKFLOW_REMOVE_TRANSFORM_STEP'
export const WORKFLOW_DUPLICATE_TRANSFORM_STEP = 'WORKFLOW_DUPLICATE_TRANSFORM_STEP'
export const WORKFLOW_MOVE_TRANSFORM_STEP_UP = 'WORKFLOW_MOVE_TRANSFORM_STEP_UP'
export const WORKFLOW_MOVE_TRANSFORM_STEP_DOWN = 'WORKFLOW_MOVE_TRANSFORM_STEP_DOWN'
export const WORKFLOW_CLEAR_TRANSFORM_STEP_OUTPUT = 'WORKFLOW_CLEAR_TRANSFORM_STEP_OUTPUT'
export const WORKFLOW_UNDO_CHANGES = 'WORKFLOW_UNDO_CHANGES'
export const SET_TEMPLATE = 'SET_TEMPLATE'
export const SET_WORKFLOW = 'SET_WORKFLOW'
export const SET_WORKFLOW_REF = 'SET_WORKFLOW_REF'
export const SET_RUN_MODE = 'SET_RUN_MODE'
export const WORKFLOW_RESET_DRY_RUN_ID = 'WORKFLOW_RESET_DRY_RUN_ID'
export const WORKFLOW_RESET_EDITED_CLEARED_CELLS = 'WORKFLOW_RESET_EDITED_CLEARED_CELLS'

// temp action used to work around the api, auto sets the events
// of the workflow without having to have a working api
export const TEMP_SET_WORKFLOW_EVENTS = 'TEMP_SET_WORKFLOW_EVENTS'

export const selectLatestDryRunId = (state: RootState): string => {
  if (state.workflow.lastDryRunID) {
    return state.workflow.lastDryRunID
  }
  return ''
}

export const selectLatestDeployOrDryRunId = (state: RootState): string => {
  if (state.deploy.runId) {
    return state.deploy.runId
  }
  return state.workflow.lastDryRunID
}

export const selectLatestRunId = (state: RootState): string => {
  if (state.workflow.lastRunID) {
    return state.workflow.lastRunID
  }
  return ''
}

export const selectEditedCells = (state: RootState): boolean[] => {
  return state.workflow.editedCells
}

export const selectClearedCells = (state: RootState): boolean[] => {
  return state.workflow.clearedOutputCells
}

export const selectWorkflow = (state: RootState): Workflow => state.workflow.workflow
export const selectWorkflowQriRef = (state: RootState): QriRef => {
  return qriRefFromDataset(state.workflow.dataset)
}
export const selectRunMode = (state: RootState): RunMode => state.workflow.runMode
export const selectWorkflowIsDirty = (state: RootState): boolean => state.workflow.isDirty
export const selectWorkflowDataset = (state: RootState): Dataset => state.workflow.dataset
export const selectApplyStatus = (state: RootState): ApplyStatus => state.workflow.applyStatus



export type RunMode =
  | 'apply'
  | 'save'

export type ApplyStatus =
  | ''
  | 'loading'
  | 'error'

export interface WorkflowState {
  runMode: RunMode
  workflow: Workflow
  // working dataset for editing transform steps, setting dataset name, etc
  dataset: Dataset
  // stores the "clean" state of triggers, steps, and hooks, used to compare
  // with working state to determine isDirty
  workflowBase: WorkflowBase
  // stores a boolean value for each workflow code cell to represent if
  // cell was edited
  editedCells: boolean[]
  // stores a boolean value for each workflow code cell to represent if
  // cell output was cleared
  clearedOutputCells: boolean[]
  isDirty: boolean
  lastDryRunID: string
  lastRunID?: string
  // state for the async request to /apply
  applyStatus: ApplyStatus
}

const initialState: WorkflowState = {
  runMode: 'apply',
  workflow: {
    id: '',
    initID: '',
    active: true,

    triggers: [],
    hooks: []
  },
  dataset: NewDataset({}),
  workflowBase: {
    triggers: [],
    steps: [],
    hooks: []
  },
  editedCells: [],
  clearedOutputCells: [],
  isDirty: false,
  lastRunID: '',
  lastDryRunID: '',
  applyStatus: ''
}

export const workflowReducer = createReducer(initialState, {
  'API_APPLY_REQUEST': (state, action) => {
    state.applyStatus = 'loading'
    state.editedCells = state.editedCells.map(c => false)
    state.clearedOutputCells = state.clearedOutputCells.map(c => false)
  },
  'API_APPLY_SUCCESS': (state, action) => {
    state.applyStatus = ''
    const runID = action.payload.data.runID
    state.lastDryRunID = runID
  },
  'API_APPLY_FAILURE': (state, action) => {
    state.applyStatus = 'error'
  },
  'API_RUNNOW_REQUEST': (state, action) => {
    state.editedCells = state.editedCells.map(c => false)
    state.clearedOutputCells = state.clearedOutputCells.map(c => false)
  },
  'API_RUNNOW_SUCCESS': (state, action) => {
    state.lastRunID = action.payload.data
  },
  SET_RUN_MODE: (state, action: RunModeAction) => {
    if (state.runMode !== action.mode) {
      state.runMode = action.mode
    }
  },
  WORKFLOW_CHANGE_TRIGGER: changeWorkflowTrigger,
  WORKFLOW_DELETE_TRIGGER: deleteWorkflowTrigger,
  WORKFLOW_CHANGE_TRANSFORM_STEP: changeWorkflowTransformStep,
  WORKFLOW_ADD_TRANSFORM_STEP: addWorkflowTransformStep,
  WORKFLOW_REMOVE_TRANSFORM_STEP: removeWorkflowTransformStep,
  WORKFLOW_DUPLICATE_TRANSFORM_STEP: duplicateWorkflowTransformStep,
  WORKFLOW_MOVE_TRANSFORM_STEP_UP: moveWorkflowTransformStepUp,
  WORKFLOW_MOVE_TRANSFORM_STEP_DOWN: moveWorkflowTransformStepDown,
  WORKFLOW_CLEAR_TRANSFORM_STEP_OUTPUT: clearWorkflowTransformStepOutput,
  WORKFLOW_UNDO_CHANGES: workflowUndoChanges,
  SET_WORKFLOW_REF: (state, action: SetWorkflowRefAction) => {
    state.dataset.username = action.qriRef.username
    state.dataset.name = action.qriRef.name
  },
  // listen for dataset fetching actions, if the reference of the fetched dataset
  // matches the ref the workbench reducer is tuned to, load the transform script
  // into the workbench
  'API_PREVIEW_SUCCESS': (state, action) => {
    const d = action.payload.data as Dataset
    // TODO (b5) - this should check peername *and* confirm the loaded version is HEAD
    state.dataset = d

    // set the values to compare with and caclulate isDirty
    state.workflowBase.steps = d.transform?.steps
    state.isDirty = calculateIsDirty(state)
  },
  'API_WORKFLOW_REQUEST': (state, action) => {
    // reset workflow and lastRunID to initialState values
    state.runMode = initialState.runMode
    state.workflow = initialState.workflow
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
    state.workflow = w

    // set the values to compare with and caclulate isDirty
    state.workflowBase.triggers = w.triggers
    state.workflowBase.hooks = w.hooks
    state.isDirty = calculateIsDirty(state)
    // state.workflow.steps = steps
  },
  'API_DEPLOY_SUCCESS': (state, action) => {
    state.isDirty = false
  },
  SET_TEMPLATE: (state: WorkflowState, action: SetTemplateAction) => {
    state.dataset = action.dataset
    state.workflowBase.steps = action.dataset.transform?.steps
    state.editedCells = action.dataset.transform?.steps.map(s => false) || []
    state.clearedOutputCells = action.dataset.transform?.steps.map(s => false) || []
    return
  },
  'RESET_WORKFLOW_STATE': (state: WorkflowState, action: SetTemplateAction) => {
    return initialState
  },
  WORKFLOW_RESET_DRY_RUN_ID: (state: WorkflowState, actions: UndoWorkflowChanges) => {
    state.lastDryRunID = ''
  },
  WORKFLOW_RESET_EDITED_CLEARED_CELLS: (state: WorkflowState, actions: UndoWorkflowChanges) => {
    state.editedCells = state.editedCells.map(c => false)
    state.clearedOutputCells = state.clearedOutputCells.map(c => false)
  }
})

function calculateIsDirty(state: WorkflowState) {
  const workflowCompare = {
    triggers: state.workflow.triggers,
    steps: state.dataset.transform?.steps,
    hooks: state.workflow.hooks
  }
  return !DeepEqual(workflowCompare, state.workflowBase)
}

function changeWorkflowTrigger(state: WorkflowState, action: WorkflowTriggerAction) {
  // TODO(chriswhong): allow for more than one trigger
  state.workflow.triggers = [action.trigger]
  state.isDirty = calculateIsDirty(state)
  return
}

function deleteWorkflowTrigger(state: WorkflowState, actions: WorkflowStepAction) {
  state.workflow.triggers?.splice(actions.index,1)
  state.isDirty = calculateIsDirty(state)
  return
}

function changeWorkflowTransformStep(state: WorkflowState, action: SetWorkflowStepAction) {
  if (state.dataset.transform?.steps) {
    state.dataset.transform.steps[action.index].script = action.script
    state.editedCells[action.index] = true
  }

  state.isDirty = calculateIsDirty(state)

  return
}

function addWorkflowTransformStep(state: WorkflowState, action: AddWorkflowStepAction) {
  if (state.dataset.transform?.steps) {
    state.dataset.transform.steps.splice(action.index+1,0,
      {script: '', category: action.syntax+'_'+new Date().valueOf(), name: action.syntax+'_'+new Date().valueOf(), syntax: action.syntax})
    state.editedCells.splice(action.index+1, 0, true)
    state.clearedOutputCells.splice(action.index+1, 0, true)
  }

  state.isDirty = calculateIsDirty(state)

  return
}

function clearWorkflowTransformStepOutput(state: WorkflowState, actions: WorkflowStepAction) {
  state.clearedOutputCells[actions.index] = true
}

function removeWorkflowTransformStep(state: WorkflowState, action: WorkflowStepAction) {
  if (state.dataset.transform?.steps) {
    state.dataset.transform.steps.splice(action.index,1)
    state.editedCells.splice(action.index,1)
    state.clearedOutputCells.splice(action.index,1)
  }

  return
}

function duplicateWorkflowTransformStep(state: WorkflowState, action: WorkflowStepAction) {
  if (state.dataset.transform?.steps) {
    const duplicateStep = {...state.dataset.transform.steps[action.index]}
    duplicateStep.name = duplicateStep.syntax+'_'+new Date().valueOf()
    duplicateStep.category = duplicateStep.syntax+'_'+new Date().valueOf()
    state.dataset.transform.steps.splice(action.index+1,0, duplicateStep)
    state.editedCells.splice(action.index+1,0,true)
    state.clearedOutputCells.splice(action.index+1,0,true)
  }

  return
}

function moveWorkflowTransformStepUp (state: WorkflowState, action: WorkflowStepAction) {
  if(state.dataset.transform?.steps && action.index > 0){
    const movedElement = state.dataset.transform.steps.splice(action.index,1)[0]
    state.dataset.transform.steps.splice(action.index-1,0,movedElement)
    const movedEditCell = state.editedCells.splice(action.index,1)[0]
    state.editedCells.splice(action.index-1,0,movedEditCell)
    const movedClearedCell = state.clearedOutputCells.splice(action.index,1)[0]
    state.clearedOutputCells.splice(action.index-1,0,movedClearedCell)
  }
  return
}

function workflowUndoChanges (state: WorkflowState, actions: UndoWorkflowChanges) {
  state.workflow.triggers = state.workflowBase.triggers
  state.workflow.hooks = state.workflowBase.hooks
  if (state.dataset.transform) {
    state.dataset.transform.steps = state.workflowBase.steps || []
  }
}

function moveWorkflowTransformStepDown (state: WorkflowState, action: WorkflowStepAction) {
  if(state.dataset.transform?.steps && action.index < state.dataset.transform.steps.length){
    const movedElement = state.dataset.transform.steps.splice(action.index,1)[0];
    state.dataset.transform.steps.splice(action.index+1,0,movedElement)
    const movedEditCell = state.editedCells.splice(action.index,1)[0]
    state.editedCells.splice(action.index+1,0,movedEditCell)
    const movedClearedCell = state.clearedOutputCells.splice(action.index,1)[0]
    state.clearedOutputCells.splice(action.index+1,0,movedClearedCell)
  }
  return
}
