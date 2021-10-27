import { createReducer } from '@reduxjs/toolkit'

import { RootState } from '../../../store/store'
import { PageInfo, SearchResult } from '../../../qri/search'
import { UserProfile, NewUserProfile } from '../../../qri/userProfile'
import { ApiErr, NewApiErr } from '../../../store/api'

export const selectUserProfile = (state: RootState): UserProfile => state.userProfile.profile
export const selectUserProfileLoading = (state: RootState): boolean => state.userProfile.loading
export const selectUserProfileError = (state: RootState): ApiErr => state.userProfile.error
export const selectUserProfileDatasets = (state: RootState): PaginatedResults => state.userProfile.datasets
export const selectUserProfileFollowing = (state: RootState): PaginatedResults => state.userProfile.following

export interface PaginatedResults {
  results: SearchResult[]
  pageInfo: PageInfo
  loading: boolean
}

const NewPaginatedResults = () => {
  return {
    results: [],
    pageInfo: {
      nextUrl: '',
      page: 0,
      pageSize: 0,
      pageCount: 0,
      prevUrl: '',
      resultCount: 0
    },
    loading: false
  }
}

export interface UserProfileState {
  profile: UserProfile
  loading: boolean
  error: ApiErr
  datasets: {
    results: SearchResult[]
    pageInfo: PageInfo
    loading: boolean
  }
  following: {
    results: SearchResult[]
    pageInfo: PageInfo
    loading: boolean
  }
}

const initialState: UserProfileState = {
  profile: NewUserProfile(),
  loading: false,
  error: NewApiErr(),
  datasets: NewPaginatedResults(),
  following: NewPaginatedResults()
}

export const userProfileReducer = createReducer(initialState, {
  'API_USERPROFILE_REQUEST': (state: UserProfileState, action) => {
    state.loading = true
  },
  'API_USERPROFILE_SUCCESS': (state: UserProfileState, action) => {
    state.profile = action.payload.data
    state.loading = false
  },
  'API_USERPROFILE_FAILURE': (state: UserProfileState, action) => {
    state.loading = false
    state.error = action.payload.err
  },

  'API_USERPROFILEDATASETS_REQUEST': (state: UserProfileState, action) => {
    state.datasets.loading = true
  },
  'API_USERPROFILEDATASETS_SUCCESS': (state: UserProfileState, action) => {
    state.datasets.results = action.payload.data
    state.datasets.pageInfo = action.payload.pagination
    state.datasets.loading = false
  },
  'API_USERPROFILEDATASETS_FAILURE': (state: UserProfileState) => {
    state.datasets.loading = false
  },

  'API_USERPROFILEFOLLOWING_REQUEST': (state: UserProfileState, action) => {
    state.following.loading = true
  },
  'API_USERPROFILEFOLLOWING_SUCCESS': (state: UserProfileState, action) => {
    state.following.results = action.payload.data
    state.following.pageInfo = {
      // TODO(chriswhong): this API doesn't return resultCount,
      // this will ensure it exists in the frontend in development
      ...action.payload.pagination,
      resultCount: state.following?.results ? state.following.results.length : 0
    }
    state.following.loading = false
  },
  'API_USERPROFILEFOLLOWING_FAILURE': (state: UserProfileState) => {
    state.following.loading = false
  },
})
