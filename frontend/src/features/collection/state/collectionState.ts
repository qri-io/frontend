import { RootState } from '../../../store/store';
import { createReducer } from '@reduxjs/toolkit'
import { datasetAliasFromVersionInfo, VersionInfo } from '../../../qri/versionInfo';

export const WORKFLOW_STARTED = 'WORKFLOW_STARTED'
export const WORKFLOW_COMPLETED = 'WORKFLOW_COMPLETED'

export const selectCollection = (state: RootState): VersionInfo[] => {
  const { collection, running } = state.collection

  var ordered: VersionInfo[] = []
  running.forEach((id: string) => {
    // websocket may notify us about a running workflow that we haven't
    // loaded locally yet. Return early if id is not in collection
    if (!collection[id]) {
      return
    }
    ordered.push(collection[id])
  })

  Object.keys(collection).forEach( (id: string) => {
    if (running.includes(id)) {
      return
    }
    ordered.push(collection[id])
  })
  return ordered.sort((a, b) => {
    const aVal = `${a.username}/${a.name}`
    const bVal = `${b.username}/${b.name}`
    if (aVal === bVal) {
      return 0
    } else {
      return (aVal < bVal) ? -1 : 1
    }
  })
}

export const selectIsCollectionLoading = (state: RootState): boolean => state.collection.collectionLoading && state.collection.runningLoading

export interface CollectionState {
  // collection is a record of all the workflow infos
  collection: Record<string, VersionInfo>
  // running contains the ids of the currently running workflows in reverse chronological
  // order based on latestRunTime
  running: string[]
  collectionLoading: boolean
  runningLoading: boolean
}

const initialState: CollectionState = {
  collection: {},
  running: [],
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
    action.payload.data.forEach((d: VersionInfo) => {
      state.collection[d.initID] = d
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
    action.payload.data.forEach( (workflow: VersionInfo) => {
      var alias = workflow.initID
      if (alias === '') {
        alias = datasetAliasFromVersionInfo(workflow)
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
