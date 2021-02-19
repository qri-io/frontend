import { createReducer } from '@reduxjs/toolkit'
import { RootState } from '../../../store/store';

export const selectSessionUser = (state: RootState): User | undefined => state.session.user
export const selectIsSessionLoading = (state: RootState): boolean => state.session.loading

export interface User {
  username: string
}

export interface SessionState {
  user?: User
  loading: boolean
}

const initialState: SessionState = {
  user: undefined,
  loading: false
}

export const sessionReducer = createReducer(initialState, {
  'API_LOGIN_REQUEST': (state, action) => {
    state.loading = true
  },
  'API_LOGIN_SUCCESS': (state, action) => {
    state.user = {
      username: action.payload.username
    }
    state.loading = false
  },
  'API_LOGOUT_SUCCESS': (state, action) => {
    state.user = undefined
  },
  'API_SIGNUP_REQUEST': (state, action) => {
    state.loading = true
  },
  'API_SIGNUP_SUCCESS': (state, action) => {
    state.user = {
      username: action.payload.username
    }
    state.loading = false
  },
})
