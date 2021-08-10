import { createReducer, Action } from '@reduxjs/toolkit'
import { RootState } from '../../../store/store';

interface SessionTokens {
  token: string
  refreshToken: string
}

export const selectSessionUser = (state: RootState): User => state.session.user
export const selectSessionTokens = (state: RootState): SessionTokens => {
  return {
    token: state.session.token,
    refreshToken: state.session.refreshToken
  }
}
export const selectIsSessionLoading = (state: RootState): boolean => state.session.loading

export interface User {
  name?: string
  profile?: string
  username: string
  description?: string
}

export interface SessionState {
  user: User
  loading: boolean
  token: string
  refreshToken: string
}

export const AnonUser: User = {
  username: 'new'
}

function getAuthState(): SessionState {
  try {
    const token = JSON.parse(localStorage.getItem('state.auth.token')) || '';
    const refreshToken = JSON.parse(localStorage.getItem('state.auth.refreshToken')) || '';
    const user = JSON.parse(localStorage.getItem('state.auth.user')) || AnonUser;

    return {
      token,
      refreshToken,
      user,
      loading: false
    }
  } catch (err) {
    return {
      token: '',
      refreshToken: '',
      user: AnonUser,
      loading: false
    };
  }
}


const initialState: SessionState = getAuthState()

// same state changes on successful login or signup
const loginOrSignupSuccess = (state: SessionState, action: Action) => {
  const {
    name,
    profile,
    username,
    description,
  } = action.user

  state.user = {
    name,
    profile,
    username,
    description,
  }
  state.loading = false

  state.token = action.token
  state.refreshToken = action.refreshToken
}

export const sessionReducer = createReducer(initialState, {
  'LOGIN_REQUEST': (state: SessionState) => {
    state.loading = true
  },
  'LOGIN_SUCCESS': loginOrSignupSuccess,
  'LOGIN_FAILURE': (state: SessionState) => {
    state.loading = false
  },
  'SIGNUP_REQUEST': (state: SessionState) => {
    state.loading = true
  },
  'SIGNUP_FAILURE': (state: SessionState) => {
    state.loading = false
  },
  'SIGNUP_SUCCESS': loginOrSignupSuccess,
  'LOGOUT_SUCCESS': (state: SessionState) => {
    state.user = AnonUser
    state.token = ''
  },
  // called after accessToken refresh
  'SET_TOKEN': (state: SessionState, action: Action) => {
    state.token = action.token
  }
})
