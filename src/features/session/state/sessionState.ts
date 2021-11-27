import { createReducer } from '@reduxjs/toolkit'
import { NewUserProfile, UserProfile } from '../../../qri/userProfile'
import { RootState } from '../../../store/store'

interface SessionTokens {
  token: string
  refreshToken: string
}

export const RESET_FORGOT_STATE = 'RESET_FORGOT_STATE'

export const selectSessionUser = (state: RootState): UserProfile => state.session.user

export const selectSessionTokens = (state: RootState): SessionTokens => {
  return {
    token: state.session.token,
    refreshToken: state.session.refreshToken
  }
}
export const selectIsSessionLoading = (state: RootState): boolean => state.session.loading
export const selectIsLoggedIn = (state: RootState): boolean => state.session.user.username !== 'new'

export const selectResetError = (state: RootState): string => state.session.resetError

export const selectResetSent = (state: RootState): boolean => state.session.resetSent

export interface SessionState {
  user: UserProfile
  loading: boolean
  token: string
  refreshToken: string
  resetSent: boolean
  resetError: string
}

export const AnonUser = NewUserProfile({ username: 'new' })

function getAuthState (): SessionState {
  try {
    const token = localStorage.getItem('state.auth.token') || ''
    const refreshToken = localStorage.getItem('state.auth.refreshToken') || ''
    const userStr = localStorage.getItem('state.auth.user') || ''
    const user = userStr === '' ? AnonUser : JSON.parse(userStr)

    return {
      token: JSON.parse(token),
      refreshToken: JSON.parse(refreshToken),
      user: user,
      loading: false,
      resetSent: false,
      resetError: ''
    }
  } catch (err) {
    return {
      token: '',
      refreshToken: '',
      user: AnonUser,
      loading: false,
      resetSent: false,
      resetError: ''
    }
  }
}

const initialState: SessionState = getAuthState()

interface AuthAction {
  user: UserProfile
  token: string
  refreshToken: string
}

// same state changes on successful login or signup
const loginOrSignupSuccess = (state: SessionState, action: AuthAction) => {
  const pro = NewUserProfile(action.user)
  state.user = pro
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
  'API_FORGOT_REQUEST': (state: SessionState) => {
    state.loading = true
    state.resetError = ''
  },
  'API_FORGOT_SUCCESS': (state: SessionState) => {
    state.loading = false
    state.resetSent = true
  },
  'API_FORGOT_FAILURE': (state: SessionState, action) => {
    state.resetError = cleanErrorMessage(action.payload.err.message)
    state.loading = false
  },
  'RESET_REQUEST': (state: SessionState) => {
    state.loading = true
  },
  'RESET_SUCCESS': loginOrSignupSuccess,
  'RESET_FAILURE': (state: SessionState, action) => {
    state.loading = false
    state.resetError = action.error
  },
  // called after accessToken refresh
  'SET_TOKEN': (state: SessionState, action: AuthAction) => {
    state.token = action.token
  },
  RESET_FORGOT_STATE: (state: SessionState) => {
    state.resetError = ''
    state.resetSent = false
  }
})

const cleanErrorMessage = (err: string): string => {
  if (err.includes('404:')) {
    return err.replace('404: ', '')
  }
  return err
}
