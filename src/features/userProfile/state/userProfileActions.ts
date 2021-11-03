import { ApiAction, ApiActionThunk, CALL_API } from "../../../store/api"

import { NewSearchResult } from '../../../qri/search'
import { UserProfileDatasetListParams } from '../../../qri/userProfile'

export const searchPageSizeDefault = 25

export function loadUserProfile (username: string): ApiActionThunk {
  return async (dispatch, getState) => {
    return dispatch(fetchUserProfile(username))
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

const mapFrontendParams = (frontendParams: UserProfileDatasetListParams) => {
  // map frontend 'sort' param to backend 'orderBy'
  return {
    orderBy: frontendParams.sort === 'recentlyupdated' ? 'created,desc' : 'name,asc'
  }
}

function fetchUserProfileDatasets (username: string, userProfileParams: UserProfileDatasetListParams): ApiAction {
  return {
    type: 'userprofiledatasets',
    [CALL_API]: {
      endpoint: `dataset_summary/${username}`,
      method: 'GET',
      query: mapFrontendParams(userProfileParams),
      pageInfo: {
        page: userProfileParams.page,
        pageSize: userProfileParams.pageSize
      },
      map: mapSearchResults
    }
  }
}

function fetchUserProfileFollowing (username: string, userProfileParams: UserProfileDatasetListParams): ApiAction {
  return {
    type: 'userprofilefollowing',
    [CALL_API]: {
      endpoint: `follow/${username}`,
      method: 'GET',
      query: mapFrontendParams(userProfileParams),
      pageInfo: {
        page: userProfileParams.page,
        pageSize: userProfileParams.pageSize
      },
      map: mapSearchResults
    }
  }
}
