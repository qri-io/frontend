import { RootState } from '../../../store/store'
import { createReducer } from '@reduxjs/toolkit'
import { UserProfile } from '../../../qri/userProfile'
import { ApiErr } from '../../../store/api'

export interface UsersState {
  // profiles is a record of all the fetched user profiles, indexed by username
  profiles: Record<string, UserProfile>
  // loading is a record of all the user profiles that are currently loading, indexed by username
  loading: Record<string, boolean>
  // errors is a record of all the user profile errors, indexed by username
  errors: Record<string, ApiErr>
}

export const selectUserProfile = (username: string): (state: RootState) => UserProfile =>
  (state) => state.users.profiles[username]

export const selectUserProfileLoading = (username: string): (state: RootState) => boolean => (state) => state.users.loading[username] === undefined || state.users.loading[username]

export const selectUserProfileError = (username: string): (state: RootState) => ApiErr => (state) => state.users.errors[username]

function getInitialUsersState (): UsersState {
  let state: UsersState = {
    profiles: {},
    loading: {},
    errors: {}
  }
  try {
    const userStr = localStorage.getItem('state.auth.user') || ''
    if (userStr !== '') {
      const user = JSON.parse(userStr)
      state.profiles[user.username] = user
      state.loading[user.username] = false
    }
  } catch (err) {
    return state
  }
  return state
}

const initialState: UsersState = getInitialUsersState()

const profileRequest = (state: UsersState, action: any) => {
  state.loading[action.segments.username] = true
  delete state.errors[action.username]
}

const profileSuccess = (state: UsersState, action: any) => {
  const username = action.payload.data.username
  state.profiles[username] = action.payload.data
  state.loading[username] = false
}

const profileFailure = (state: UsersState, action: any) => {
  const username = action.payload.request.segments.username
  state.loading[username] = false
  state.errors[username] = action.payload.err
}

export const usersReducer = createReducer(initialState, {
  'API_USERPROFILE_REQUEST': profileRequest,
  'API_USERPROFILE_SUCCESS': profileSuccess,
  'API_USERPROFILE_FAILURE': profileFailure,
  'LOGIN_SUCCESS': (state: UsersState, action) => {
    state.profiles[action.user.username] = action.user
    state.loading[action.user.username] = false
  }
})
