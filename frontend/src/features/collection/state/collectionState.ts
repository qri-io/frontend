import { RootState } from '../../../store/store';
import { createReducer } from '@reduxjs/toolkit'
import { datasetAliasFromWorkflowInfo, WorkflowInfo } from '../../../qrimatic/workflow';

export const WORKFLOW_STARTED = 'WORKFLOW_STARTED'
export const WORKFLOW_COMPLETED = 'WORKFLOW_COMPLETED'

export const selectCollection = (state: RootState): WorkflowInfo[] => {
  const collection = state.collection.collection
  const running = state.collection.running
  const ids = state.collection.ids

  var ordered: WorkflowInfo[] = []
  running.forEach( (id: string) => {
    ordered.push(collection[id])
  })

  ids.forEach( (id: string) => {
    if (running.includes(id)) {
      return
    }
    ordered.push(collection[id])
  })
  return ordered
}

export const selectIsCollectionLoading = (state: RootState): boolean => state.collection.collectionLoading && state.collection.runningLoading

export interface CollectionState {
  // collection is a record of all the workflow infos
  collection: Record<string, WorkflowInfo>
  // running contains the ids of the currently running workflows in reverse chronological
  // order based on latestRunTime
  running: string[]
  // ids contains the ids of all the workflows in reverse chronological order based
  // on commitTime
  ids: string[]
  collectionLoading: boolean
  runningLoading: boolean
}

const initialState: CollectionState = {
  collection: {},
  running: [],
  ids: [],
  collectionLoading: true,
  runningLoading: true
}

export const collectionReducer = createReducer(initialState, {
  'API_COLLECTION_REQUEST': (state, action) => {
    state.collection = {}
    state.ids = []
    state.collectionLoading = true
  },
  'API_COLLECTION_SUCCESS': (state, action) => {
    action.payload.data.forEach((workflow: WorkflowInfo) => {
      state.collection[workflow.id] = workflow
      state.ids.push(workflow.id)
    })
    state.collectionLoading = false
  },
  'API_COLLECTION_FAILURE': (state, action) => {
    state.runningLoading = false
  },
  'API_RUNNING_REQUEST': (state, action) => {
    state.running = []
    state.runningLoading = true
  },
  'API_RUNNING_SUCCESS': (state, action) => {
    var running: string[] = []
    action.payload.data.forEach( (workflow: WorkflowInfo) => {
      var alias = workflow.id
      if (alias === '') {
        alias = datasetAliasFromWorkflowInfo(workflow)
      }
      state.collection[alias] = workflow
      running.push(alias)
    })
    state.running = running
    state.runningLoading = false
  },
  'API_RUNNING_FAILURE': (state, action) => {
    state.runningLoading = false
  },
  WORKFLOW_STARTED: (state, action) => {
    const id = action.data.id
    const i = state.running.findIndex((runningID: string) => runningID === id)
    if (i !== -1) {
      state.running.splice(i, 1)
    }
    state.running.unshift(id)
    state.collection[id] = action.data
  },
  WORKFLOW_COMPLETED: (state, action) => {
    state.collection[action.data.id] = action.data
  }
})