import { createReducer } from '@reduxjs/toolkit'
import { RootState } from '../../../store/store';

export const selectSessionUser = (state: RootState): User => state.session.user
export const selectSessionToken = (state: RootState): string => state.session.token
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
}

export const AnonUser: User = {
  username: 'new'
}

function getAuthState(): SessionState {
  try {
    const token = JSON.parse(localStorage.getItem('state.auth.token')) || '';
    const user = JSON.parse(localStorage.getItem('state.auth.user')) || AnonUser;

    return {
      token,
      user,
      loading: false
    }
  } catch (err) {
    return {
      token: '',
      user: AnonUser,
      loading: false
    };
  }
}


const initialState: SessionState = getAuthState()

// same state changes on successful login or signup
const loginOrSignupSuccess = (state, action) => {
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
}

export const sessionReducer = createReducer(initialState, {
  'LOGIN_REQUEST': (state) => {
    state.loading = true
  },
  'LOGIN_SUCCESS': loginOrSignupSuccess,
  'LOGIN_FAILURE': (state) => {
    state.loading = false
  },
  'SIGNUP_REQUEST': (state) => {
    state.loading = true
  },
  'SIGNUP_FAILURE': (state) => {
    state.loading = false
  },
  'SIGNUP_SUCCESS': loginOrSignupSuccess,
  'LOGOUT_SUCCESS': (state) => {
    state.user = AnonUser
    state.token = ''
  }
})
