import { RootState } from '../../../store/store';
import { createReducer } from '@reduxjs/toolkit'
import { newVersionInfo, VersionInfo } from '../../../qri/versionInfo';
import { CALL_API } from "../../../store/api";
import { runEndTime } from '../../../utils/runEndTime';
import {
  LogbookWriteAction,
  RemoveCollectionItemAction,
  ResetCollectionStateAction,
  TransformStartAction
} from './collectionActions';

export const LOGBOOK_WRITE_COMMIT = 'LOGBOOK_WRITE_COMMIT'
export const LOGBOOK_WRITE_RUN = 'LOGBOOK_WRITE_RUN'
export const TRANSFORM_START = 'TRANSFORM_START'
export const REMOVE_COLLECTION_ITEM = 'REMOVE_COLLECTION_ITEM'
export const RESET_COLLECTION_STATE = 'RESET_COLLECTION_STATE'

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
  TRANSFORM_START: transformStart,
  LOGBOOK_WRITE_RUN: logbookWriteRun,
  LOGBOOK_WRITE_COMMIT: logbookWriteCommit,
  REMOVE_COLLECTION_ITEM:removeCollectionItem,
  RESET_COLLECTION_STATE: (state: CollectionState, action: ResetCollectionStateAction) => {
    return initialState
  },
})

function transformStart(state: CollectionState, action: TransformStartAction) {
  const { collection } = state
  const { mode, initID, runID } = action.lc

  if (mode === "apply" || !collection[initID]) return

  collection[initID].runStatus = "running"
  collection[initID].runID = runID
  collection[initID].runCount++
}

function logbookWriteRun(state: CollectionState, action: LogbookWriteAction) {
  const { collection } = state
  const { initID, runID, runStatus, runDuration, runStart } = action.vi

  if (!collection[initID]) return

  collection[initID].runID = runID
  collection[initID].runStatus = runStatus
  collection[initID].runDuration = runDuration
  collection[initID].runStart = runStart
}

function removeCollectionItem(state: CollectionState, action: RemoveCollectionItemAction) {
  let deleteItemInitId:string = '';
  Object.keys(state.collection).forEach(key => {
    if(state.collection[key].username === action.username && state.collection[key].name === action.name){
      deleteItemInitId = state.collection[key].initID
    }
  })
  if (deleteItemInitId.length) {
    delete state.collection[deleteItemInitId]
  }
}

function logbookWriteCommit(state: CollectionState, action: LogbookWriteAction) {
  const { collection } = state
  const { vi } = action

  if (!collection[vi.initID]) return

  const {
    workflowID,
    downloadCount,
    runCount,
    followerCount,
    openIssueCount,
    runID,
    runStatus,
    runDuration,
    runStart
  } = collection[vi.initID]

  // preserve fields that are not tracked in logbookWriteCommit
  vi.workflowID = workflowID
  vi.downloadCount = downloadCount
  vi.runCount = runCount
  vi.followerCount = followerCount
  vi.openIssueCount = openIssueCount

  // preserve "last run" information
  if (vi.runID === "") {
    vi.runID = runID
    vi.runStatus = runStatus
    vi.runDuration = runDuration
    vi.runStart = runStart
  }

  collection[vi.initID] = vi
}
