import { ThunkDispatch } from "redux-thunk"
import { newQriRef } from "../../../qri/ref"
import { mapProfile } from "../../../qri/userProfile"
import { ApiAction, CALL_API } from "../../../store/api"
import { RootState } from "../../../store/store"
import { selectUserProfile } from "./usersState"

export function loadUser (username: string) {
  return async (dispatch: ThunkDispatch<any, any, any>, getState: () => RootState) => {
    const state = getState()
    const user = selectUserProfile(username)(state)
    if (user) { return user }

    if (!state.users.loading[username]) {
      return dispatch(fetchUser(username))
    }
  }
}

function fetchUser (username: string): ApiAction {
  return {
    type: 'userprofile',
    [CALL_API]: {
      endpoint: `identity/profile/`,
      method: 'GET',
      segments: newQriRef({ username }),
      map: mapProfile
    }
  }
}
