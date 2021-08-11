import { ApiAction, ApiActionThunk, CALL_API} from '../../../store/api'

// logIn will get a token from the API, then use that token to immediately get User data
export function logIn (username: string, password: string): ApiActionThunk {
  return async (dispatch) => {
    dispatch({
      type: 'LOGIN_REQUEST'
    })

    try {
      // get the json web token
      const tokenResponse = await dispatch(fetchToken(username, password))

      if (tokenResponse.type === 'API_TOKEN_FAILURE') {
        throw new Error(`Login failed: ${tokenResponse.payload.err.message}`)
      }

      const token = tokenResponse.payload.data.access_token
      const refreshToken = tokenResponse.payload.data.refresh_token

      // get user data
      // pass access_token directly to fetchUserProfile so it can be used immediately
      const userResponse = await dispatch(fetchUserProfile(token))

      if (userResponse.type === 'API_SESSION_FAILURE') {
        throw new Error(`Could not get user: ${userResponse.payload.err.message}`)
      }

      // TODO(chriswhong): workaround to get a username and photo from the local session response
      // remove once this is talking to qri cloud backend
      const user = {
        username: userResponse.payload.data.peername,
        profile: userResponse.payload.data.photo,
        ...userResponse.payload.data
      }

      return dispatch({
        type: 'LOGIN_SUCCESS',
        user,
        token,
        refreshToken
      })
    } catch (e) {
      return dispatch({
        type: 'LOGIN_FAILURE',
        error: e.toString()
      })
    }
  }
}

export function logOut (): ApiActionThunk {
  return async (dispatch) => {
    return dispatch({ type: 'LOGOUT_SUCCESS' })
  }
}

export function signUp (email: string, username: string, password: string): ApiActionThunk {
  return async (dispatch) => {
    dispatch({
      type: 'SIGNUP_REQUEST'
    })

    try {
      // get the json web token
      const signupResponse = await dispatch(fetchSignup(email, username, password))

      if (signupResponse.type === 'API_SIGNUP_FAILURE') {
        throw new Error(`Signup failed: ${signupResponse.payload.err.message}`)
      }

      const token = signupResponse.payload.data.access_token

      // get user data
      // pass access_token directly to fetchUserProfile so it can be used immediately
      const userResponse = await dispatch(fetchUserProfile(token))

      if (userResponse.type === 'API_SESSION_FAILURE') {
        throw new Error(`Could not get user: ${userResponse.payload.err.message}`)
      }

      const user = userResponse.payload.data

      return dispatch({
        type: 'SIGNUP_SUCCESS',
        user,
        token
      })
    } catch (e) {
      return dispatch({
        type: 'SIGNUP_FAILURE',
        error: e.toString()
      })
    }
  }
}

export function fetchSignup(email: string, username: string, password: string): ApiAction {
  return {
    type: 'signup',
    [CALL_API]: {
      endpoint: 'identity/profile/new?__code=409',
      method: 'POST',
      body: {
        email,
        username,
        password
      }
    }
  }
}



export function fetchToken(username: string, password: string): ApiAction {
  return {
    type: 'token',
    [CALL_API]: {
      endpoint: 'oauth/token?grant_type=password',
      method: 'POST',
      form: {
        username,
        password
      }
    }
  }
}

export function fetchUserProfile(accessToken: string): ApiAction {
  return {
    type: 'profile',
    [CALL_API]: {
      endpoint: 'profile',
      method: 'POST',
      token: accessToken
    }
  }
}
