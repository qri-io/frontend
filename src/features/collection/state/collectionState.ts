import { RootState } from '../../../store/store';
import { createReducer } from '@reduxjs/toolkit'
import { datasetAliasFromVersionInfo, newVersionInfo, VersionInfo } from '../../../qri/versionInfo';
import { CALL_API } from "../../../store/api";

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

  state.collection.listedIDs.forEach( (id: string) => {
    if (running.includes(id)) {
      return
    }
    ordered.push(collection[id])
  })

  return ordered.sort((a,b) => {
    if (a.commitTime === b.commitTime) { return 0 }
    else if (a.commitTime > b.commitTime) { return -1 }
    return 1
  })
}

export const selectVersionInfo = ( initId: string): (state: RootState) => VersionInfo =>
  (state) => state.collection.collection[initId]

export const selectIsCollectionLoading = (state: RootState): boolean => state.collection.collectionLoading && state.collection.runningLoading

export interface CollectionState {
  // collection is a record of all the workflow infos
  collection: Record<string, VersionInfo>
  // running contains the ids of the currently running workflows in reverse chronological
  // order based on latestRunTime
  running: string[]
  // ids of datasets in the current user's collection
  listedIDs: Set<string>
  // ids of run events in middle of loading
  pendingIDs: string[]
  collectionLoading: boolean
  runningLoading: boolean

}

const initialState: CollectionState = {
  collection: {},
  running: [],
  listedIDs: new Set<string>(),
  pendingIDs: [],
  collectionLoading: true,
  runningLoading: true
}

export const collectionReducer = createReducer(initialState, {
  'API_COLLECTION_REQUEST': (state, action) => {
    state.collectionLoading = true
  },
  'API_COLLECTION_SUCCESS': (state, action) => {
    const listedIDs:Set<string> = new Set()
    action.payload.data.forEach((d: VersionInfo) => {
      state.collection[d.initID] = d
      listedIDs.add(d.initID)
    })
    state.listedIDs = listedIDs
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
  'API_VERSIONINFO_REQUEST' : (state, action) => {
    state.pendingIDs.push(action[CALL_API].body.initID)
  },
  'API_VERSIONINFO_SUCCESS':(state, action) => {
    const versionInfo: VersionInfo = action.payload.data;
    state.pendingIDs = state.pendingIDs.filter(id => id !== versionInfo.initID)
    state.collection[versionInfo.initID] = newVersionInfo(versionInfo)
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
