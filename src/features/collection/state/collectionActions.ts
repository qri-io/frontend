import { ApiAction, CALL_API, ApiActionThunk } from "../../../store/api"
import { newVersionInfo, VersionInfo } from "../../../qri/versionInfo"
import {
  LOGBOOK_WRITE_COMMIT,
  LOGBOOK_WRITE_RUN,
  REMOVE_COLLECTION_ITEM,
  RESET_COLLECTION_STATE,
  TRANSFORM_START
} from "./collectionState"
import { RootState } from "../../../store/store";
import { ThunkDispatch } from 'redux-thunk'
import { QriRef } from '../../../qri/ref'
import { TransformLifecycle } from "../../../qri/events"


function mapVersionInfo (data: object | []): VersionInfo[] {
  if (!data) { return [] }
  return (data as []).map((data) => newVersionInfo(data))
}

export function loadCollection() {
  return async (dispatch, getState) => {
    return dispatch(fetchCollection())
  }
}

export function loadVersionInfo(initID: string) {
  return async (dispatch: ThunkDispatch<any, any, any>, getState: () => RootState) => {
    const state = getState();
    if (state.collection.collection[initID]) {
      return state.collection.collection[initID]
    } else if (!state.collection.pendingIDs.includes(initID)) {
      return dispatch(fetchVersionInfo(initID))
    } else return
  }

}

function fetchCollection (): ApiAction {
  return {
    type: 'collection',
    [CALL_API]: {
      endpoint: 'list',
      method: 'POST',
      body: {
        offset: 0,
        limit: 300 // TODO(chriswhong): For now, we assume the client has the entire collection and can sort and filter locally
      },
      map: mapVersionInfo
    }
  }
}

function fetchVersionInfo (initID: string): ApiAction {
  return {
    type: 'versioninfo',
    [CALL_API]: {
      endpoint: 'collection/get',
      method: 'POST',
      body: {
        initID: initID
      },
    }
  }
}

// runnow will trigger a manual run.  On success, it will refresh the collection
export function runNow (qriRef: QriRef, initID: string): ApiActionThunk {
  return async (dispatch, getState) => {
    return dispatch(fetchRunNow(qriRef, initID))
  }
}

function fetchRunNow (qriRef: QriRef, initID: string): ApiAction {
  return {
    type: 'runnow_collection',
    qriRef,
    [CALL_API]: {
      endpoint: 'auto/run',
      method: 'POST',
      body: { ref: `${qriRef.username}/${qriRef.name}` },
      requestID: initID
    }
  }
}

export interface LogbookWriteAction {
  type: string
  vi: VersionInfo
}

export interface RemoveCollectionItemAction {
  type: string
  username: string
  name: string
}

export function logbookWriteCommitEvent(vi: VersionInfo): LogbookWriteAction {
  return {
    type: LOGBOOK_WRITE_COMMIT,
    vi
  }
}

export function logbookWriteRunEvent(vi: VersionInfo): LogbookWriteAction {
  return {
    type: LOGBOOK_WRITE_RUN,
    vi
  }
}

export function removeCollectionItem(username: string, name: string): RemoveCollectionItemAction {
  return {
    type: REMOVE_COLLECTION_ITEM,
    username: username,
    name: name
  }
}

export interface TransformStartAction {
  type: string
  lc: TransformLifecycle
}

export interface ResetCollectionStateAction {
  type: string
}

export function transformStartEvent(lc: TransformLifecycle): TransformStartAction {
  return {
    type: TRANSFORM_START,
    lc
  }
}

export function resetCollectionState() {
  return {
    type: RESET_COLLECTION_STATE
  }
}
