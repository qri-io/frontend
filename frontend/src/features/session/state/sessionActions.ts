import { ApiActionThunk} from '../../../store/api'

export function logIn (username: string, password: string): ApiActionThunk {
  return async (dispatch) => {
    dispatch({
      type: 'API_LOGIN_REQUEST'
    })

    await new Promise(resolve => setTimeout(resolve, 2000));

    return dispatch({
      type: 'API_LOGIN_SUCCESS',
      payload: {
        username
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
  return async (dispatch) => {
    dispatch({
      type: 'API_SIGNUP_REQUEST'
    })

    await new Promise(resolve => setTimeout(resolve, 2000));

    return dispatch({
      type: 'API_SIGNUP_SUCCESS',
      payload: {
        username
      }
    })
  }
}
