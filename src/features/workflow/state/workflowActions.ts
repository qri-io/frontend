import { QriRef } from '../../../qri/ref'
import { EventLogLine } from '../../../qri/eventLog'
import { NewWorkflow, Workflow, WorkflowInfo, workflowScriptString, WorkflowTrigger } from '../../../qrimatic/workflow'
import { CALL_API, ApiActionThunk, ApiAction } from '../../../store/api'
import {
  WORKFLOW_CHANGE_TRIGGER,
  WORKFLOW_DELETE_TRIGGER,
  WORKFLOW_CHANGE_TRANSFORM_STEP,
  TEMP_SET_WORKFLOW_EVENTS,
  SET_TEMPLATE,
  SET_WORKFLOW,
  SET_WORKFLOW_REF,
  WORKFLOW_ADD_TRANSFORM_STEP,
  WORKFLOW_REMOVE_TRANSFORM_STEP,
  WORKFLOW_DUPLICATE_TRANSFORM_STEP,
  WORKFLOW_MOVE_TRANSFORM_STEP_UP,
  WORKFLOW_MOVE_TRANSFORM_STEP_DOWN,
  WORKFLOW_UNDO_CHANGES,
  WORKFLOW_RESET_DRY_RUN_ID,
  WORKFLOW_CLEAR_TRANSFORM_STEP_OUTPUT,
  WORKFLOW_RESET_EDITED_CLEARED_CELLS,
  SET_WORKFLOW_DATASET_NAME,
  SET_WORKFLOW_DATASET_TITLE
} from './workflowState'
import { AnyAction } from 'redux'
import { Dataset, qriRefFromDataset } from '../../../qri/dataset'

export function mapWorkflow (d: object | []): Workflow {
  const data = (d as Record<string, any>)
  return NewWorkflow(data)
}

export function loadWorkflowByDatasetRef (qriRef: QriRef): ApiActionThunk {
  return async (dispatch, getState) => {
    return dispatch(fetchWorkflowByDatasetRef(qriRef))
  }
}

function fetchWorkflowByDatasetRef (qriRef: QriRef): ApiAction {
  return {
    type: 'workflow',
    qriRef,
    [CALL_API]: {
      endpoint: 'auto/workflow',
      method: 'POST',
      body: { ref: `${qriRef.username}/${qriRef.name}` },
      map: mapWorkflow
    }
  }
}

export function resetWorkflowState () {
  return {
    type: 'RESET_WORKFLOW_STATE'
  }
}

export function workflowResetDryRunId (): UndoWorkflowChanges {
  return {
    type: WORKFLOW_RESET_DRY_RUN_ID
  }
}

export function workflowUndoChanges (): UndoWorkflowChanges {
  return {
    type: WORKFLOW_UNDO_CHANGES
  }
}

export function workflowResetEditedClearedCells () {
  return {
    type: WORKFLOW_RESET_EDITED_CLEARED_CELLS
  }
}

export function runNow (qriRef: QriRef): ApiActionThunk {
  return async (dispatch, getState) => {
    return dispatch(fetchRunNow(qriRef))
  }
}

function fetchRunNow (qriRef: QriRef): ApiAction {
  return {
    type: 'runnow',
    qriRef,
    [CALL_API]: {
      endpoint: 'auto/run',
      method: 'POST',
      body: { ref: `${qriRef.username}/${qriRef.name}` }
    }
  }
}

export interface WorkflowStepAction {
  type: string
  index: number
}

export interface SetWorkflowStepAction extends WorkflowStepAction{
  script: string
}

export interface AddWorkflowStepAction extends WorkflowStepAction{
  syntax: string
}

export function changeWorkflowTransformStep (index: number, script: string): SetWorkflowStepAction {
  return {
    type: WORKFLOW_CHANGE_TRANSFORM_STEP,
    index,
    script
  }
}

export function clearWorkflowTransformStepOutput (index: number): WorkflowStepAction {
  return {
    type: WORKFLOW_CLEAR_TRANSFORM_STEP_OUTPUT,
    index: index
  }
}

export function addWorkflowTransformStep (index: number, syntax: string): AddWorkflowStepAction {
  return {
    type: WORKFLOW_ADD_TRANSFORM_STEP,
    index,
    syntax
  }
}

export function removeWorkflowTransformStep (index: number): WorkflowStepAction {
  return {
    type: WORKFLOW_REMOVE_TRANSFORM_STEP,
    index
  }
}

export function duplicateWorkflowTransformStep (index: number): WorkflowStepAction {
  return {
    type: WORKFLOW_DUPLICATE_TRANSFORM_STEP,
    index
  }
}

export function moveWorkflowTransformStepUp (index: number): WorkflowStepAction {
  return {
    type: WORKFLOW_MOVE_TRANSFORM_STEP_UP,
    index
  }
}

export function moveWorkflowTransformStepDown (index: number): WorkflowStepAction {
  return {
    type: WORKFLOW_MOVE_TRANSFORM_STEP_DOWN,
    index
  }
}

export interface WorkflowTriggerAction {
  type: string
  index: number
  trigger: WorkflowTrigger
}

export function changeWorkflowTrigger (index: number, trigger: WorkflowTrigger): WorkflowTriggerAction {
  return {
    type: WORKFLOW_CHANGE_TRIGGER,
    index,
    trigger
  }
}

export function deleteWorkflowTrigger (index: number): WorkflowStepAction {
  return {
    type: WORKFLOW_DELETE_TRIGGER,
    index
  }
}

export function applyWorkflowTransform (w: Workflow, d: Dataset, isNew?: boolean): ApiActionThunk {
  return async (dispatch, getState) => {
    let qriRef = qriRefFromDataset(d)
    let ref = ''

    if (!isNew) {
      ref = `${qriRef.username}/${qriRef.name}`
    }

    return dispatch({
      type: 'apply',
      [CALL_API]: {
        endpoint: 'auto/apply',
        method: 'POST',
        body: {
          ref,
          wait: false,
          transform: {
            scriptBytes: btoa(workflowScriptString(w)),
            steps: d.transform?.steps
          }
        }
      }
    })
  }
}

export function cancelRun (runID: string): ApiActionThunk {
  return async (dispatch) => {
    return dispatch({
      type: 'cancel',
      [CALL_API]: {
        endpoint: 'auto/cancel',
        method: 'POST',
        body: {
          runID
        }
      }
    })
  }
}

export interface SetWorkflowAction {
  type: string
  workflow: Workflow
}

export function setWorkflow (workflow: Workflow): SetWorkflowAction {
  return {
    type: SET_WORKFLOW,
    workflow
  }
}

export interface SetTemplateAction {
  type: string
  dataset: Dataset
}

export interface UndoWorkflowChanges {
  type: string
}

export function setTemplate (dataset: Dataset): SetTemplateAction {
  return {
    type: SET_TEMPLATE,
    dataset
  }
}

// temp action used to work around the api, auto sets the events
// of the workflow without having to have a working api
export interface TempWorkflowAction {
  type: string
  id: string
  events: EventLogLine[]
}

// temp action used to work around the api, auto sets the events
// of the workflow without having to have a working api
export function tempSetWorkflowEvents (id: string, events: EventLogLine[]): TempWorkflowAction {
  return {
    type: TEMP_SET_WORKFLOW_EVENTS,
    id,
    events
  }
}

export interface SetWorkflowRefAction {
  type: string
  qriRef: QriRef
}

export function setWorkflowRef (qriRef: QriRef): SetWorkflowRefAction {
  return {
    type: SET_WORKFLOW_REF,
    qriRef
  }
}

export interface WorkflowInfoAction extends AnyAction {
  type: string
  data: WorkflowInfo
}

export interface SetWorkflowDatasetStringAction {
  type: string
  value: string
}

export function setWorkflowDatasetName (name: string): SetWorkflowDatasetStringAction {
  return {
    type: SET_WORKFLOW_DATASET_NAME,
    value: name
  }
}

export function setWorkflowDatasetTitle (title: string): SetWorkflowDatasetStringAction {
  return {
    type: SET_WORKFLOW_DATASET_TITLE,
    value: title
  }
}
