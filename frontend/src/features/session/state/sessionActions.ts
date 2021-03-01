import { AnyAction } from '@reduxjs/toolkit'

import { ApiAction, ApiActionThunk, CALL_API} from '../../../store/api'

export function logIn (username: string, password: string): ApiActionThunk {
  return async (dispatch) => {
    dispatch({
      type: 'API_LOGIN_REQUEST'
    })

    // TODO (ramfox): we want the frontend to have some sense of identity that
    // is tied to the backend, and until we have an actual login/signup process
    // we are hijacking this to use the actual username that is recognized by
    // the backend
    // if the username typed into the login is not the username the qri node
    // goes by, we error
    // this should be replaced by an actual login process that validates the
    // password and gives the browser a token it can use to properly communicate
    // with the backend
    var peername = ''
    await dispatch(fetchUsername()).then((action: AnyAction) => {
      peername = action.payload.data
    })
    if (peername !== username) {
      return (dispatch({
        type: 'API_LOGIN_FAILURE',
        payload: {
          err: {
            message: `unrecognized username "${username}"`
          }
        }
      }))
    }

    return dispatch({
      type: 'API_LOGIN_SUCCESS',
      payload: {
        username: peername
      }
    })
  }
}

export function logOut (): ApiActionThunk {
  return async (dispatch) => {
    return dispatch({
      type: 'API_LOGOUT_SUCCESS',
      payload: {}
    })
  }
}

export function signUp (email: string, username: string, password: string): ApiActionThunk {
  // TODO (ramfox): until we have a proper sign up process (that takes a password)
  // and allows the user to have its own identity on the qri node that is separate
  // from the id assocaited with the qri node itself, let's disable this 
  // the failure dispatches a message to the user saying that there is no
  // way to currently signup
  return async (dispatch) => {
    return dispatch({
      type: 'API_SIGNUP_FAILURE',
      payload: {
        err: {
          message: "signup is currently disabled"
        }
      }
    })
  }
}

function mapUsername(profile: Record<string, any>): string {
  return profile.peername
}

export function fetchUsername(): ApiAction {
  return {
    type: 'session',
    [CALL_API]: {
      endpoint: 'me',
      method: 'GET',
      map: mapUsername
    }
  }
}