import { RootState } from '../../../store/store';
import { createReducer } from '@reduxjs/toolkit'
import { newVersionInfo, VersionInfo } from '../../../qri/versionInfo';
import { CALL_API } from "../../../store/api";
import { runEndTime } from '../../../utils/runEndTime';

export const WORKFLOW_STARTED = 'WORKFLOW_STARTED'
export const WORKFLOW_COMPLETED = 'WORKFLOW_COMPLETED'

export const selectCollection = (state: RootState): VersionInfo[] => {
  const { collection } = state.collection

  var ordered: VersionInfo[] = Object.keys(collection).map((id: string) => collection[id])

  return ordered.sort((a,b) => {
    let aTime: Date
    let bTime: Date
    if (a.runStart && a.runDuration) {
      aTime = runEndTime(a.runStart, a.runDuration)
    } else if (!a.commitTime) {
     return 0 
    } else {
      aTime = new Date(a.commitTime)
    }

    if (b.runStart && b.runDuration) {
      bTime = runEndTime(b.runStart, b.runDuration)
    } else if (!b.commitTime) {
      return 0
    } else {
      bTime = new Date(b.commitTime)
    }
    if (aTime === bTime) { return 0 }
    else if (aTime > bTime) { return -1 }
    return 1
  })
}

export const selectVersionInfo = ( initId: string): (state: RootState) => VersionInfo =>
  (state) => state.collection.collection[initId]

export const selectIsCollectionLoading = (state: RootState): boolean => state.collection.collectionLoading

export interface CollectionState {
  // collection is a record of all the workflow infos
  collection: Record<string, VersionInfo>
  // ids of datasets in the current user's collection
  listedIDs: Set<string>
  // ids of run events in middle of loading
  pendingIDs: string[]
  collectionLoading: boolean
}

const initialState: CollectionState = {
  collection: {},
  listedIDs: new Set<string>(),
  pendingIDs: [],
  collectionLoading: true,
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
    state.collectionLoading = false
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
    state.collection[id] = action.data
  },
  WORKFLOW_COMPLETED: (state, action) => {
    state.collection[action.data.id] = action.data
  },
  'API_RUNNOW_COLLECTION_SUCCESS': (state, action) => {
    const initID = action.payload.requestID
    state.collection[initID].runID = action.payload.data
  }
})
