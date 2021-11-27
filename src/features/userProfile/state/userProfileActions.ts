import { ThunkDispatch } from 'redux-thunk'

import { RootState } from "../../../store/store"
import { ApiAction, ApiActionThunk, CALL_API } from "../../../store/api"

import { NewSearchResult } from '../../../qri/search'
import { UserProfile, UserProfileDatasetListParams } from '../../../qri/userProfile'
import { mapVersionInfo } from "../../collection/state/collectionActions"
import { USERPROFILE_SET } from "./userProfileState"

export const searchPageSizeDefault = 25

export function loadUserProfile (username: string) {
  return async (dispatch: ThunkDispatch<any, any, any>, getState: () => RootState) => {
    const sessionUser = getState().session.user
    if (sessionUser.username === username) {
      return dispatch(setUserProfile(sessionUser))
    }
    return dispatch(fetchUserProfile(username))
  }
}

export interface UserProfileAction {
  type: string
  user: UserProfile
}

function setUserProfile (user: UserProfile): UserProfileAction {
  return {
    type: USERPROFILE_SET,
    user
  }
}

export function loadUserProfileDatasets (username: string, userProfileParams: UserProfileDatasetListParams): ApiActionThunk {
  return async (dispatch, getState) => {
    return dispatch(fetchUserProfileDatasets(username, userProfileParams))
  }
}

export function loadUserProfileFollowing (username: string, userProfileParams: UserProfileDatasetListParams): ApiActionThunk {
  return async (dispatch, getState) => {
    return dispatch(fetchUserProfileFollowing(username, userProfileParams))
  }
}

function fetchUserProfile (username: string): ApiAction {
  return {
    type: 'userprofile',
    [CALL_API]: {
      endpoint: `identity/profile/${username}`,
      method: 'GET'
    }
  }
}

const mapSearchResults = (results: any[]) => {
  return results.map((d) => NewSearchResult(d))
}

interface BackendListParams {
  limit: number
  offset: number
  orderBy: string
}

const mapFrontendParams = (frontendParams: UserProfileDatasetListParams): BackendListParams => {
  // map frontend 'sort' param to backend 'orderBy'
  if (frontendParams.page < 1) {
    frontendParams.page = 1
  }
  return {
    orderBy: frontendParams.sort === 'recentlyupdated' ? 'updated' : 'name',
    limit: frontendParams.pageSize,
    offset: (frontendParams.page - 1) * frontendParams.pageSize
  }
}

function fetchUserProfileDatasets (username: string, userProfileParams: UserProfileDatasetListParams): ApiAction {
  const listParams = mapFrontendParams(userProfileParams)
  return {
    type: 'userprofiledatasets',
    [CALL_API]: {
      endpoint: 'list',
      method: 'POST',
      pageInfo: {
        page: userProfileParams.page,
        pageSize: userProfileParams.pageSize
      },
      body: {
        username,
        ...listParams
      },
      map: mapVersionInfo
    }
  }
}

function fetchUserProfileFollowing (username: string, userProfileParams: UserProfileDatasetListParams): ApiAction {
  const backendParams = mapFrontendParams(userProfileParams)
  return {
    type: 'userprofilefollowing',
    [CALL_API]: {
      endpoint: `follow/${username}`,
      method: 'GET',
      query: { orderBy: backendParams.orderBy },
      pageInfo: {
        page: userProfileParams.page,
        pageSize: userProfileParams.pageSize
      },
      map: mapSearchResults
    }
  }
}
