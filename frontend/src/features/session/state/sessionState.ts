import { createReducer } from '@reduxjs/toolkit'
import { RootState } from '../../../store/store';

export const selectSessionUser = (state: RootState): User => state.session.user
export const selectIsSessionLoading = (state: RootState): boolean => state.session.loading

export interface User {
  username: string
}

export interface SessionState {
  user: User
  loading: boolean
}

export const NewUser: User = {
  username: 'new'
}

const initialState: SessionState = {
  user: NewUser,
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
  'API_LOGIN_FAILURE': (state, action) => {
    state.loading = false
  },
  'API_LOGOUT_SUCCESS': (state, action) => {
    state.user = NewUser
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
  'API_SIGNUP_FAILURE': (state, action) => {
    state.loading = false
  },
})
