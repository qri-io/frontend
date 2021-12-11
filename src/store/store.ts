import { combineReducers, applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import { ThunkAction, Action } from '@reduxjs/toolkit'
import { connectRouter, routerMiddleware, RouterState } from 'connected-react-router'
import { createBrowserHistory, History } from 'history'

import transfersReducer from '../features/transfer/state/transferState'
import { apiMiddleware } from './api'
import { RemoteEvents, websocketMiddleware } from '../features/websocket/middleware/websocket'
import { workflowReducer, WorkflowState } from '../features/workflow/state/workflowState'
import { AppState, appReducer } from '../features/app/state/appState'
import { CollectionState, collectionReducer } from '../features/collection/state/collectionState'
import { datasetReducer, DatasetState } from '../features/dataset/state/datasetState'
import { dsPreviewReducer, DsPreviewState } from '../features/dsPreview/state/dsPreviewState'
import { scrollerReducer, ScrollerState } from '../features/scroller/state/scrollerState'
import { searchReducer, SearchState } from '../features/search/state/searchState'
import { deployReducer, DeployState } from '../features/deploy/state/deployState'
import { activityFeedReducer, ActivityFeedState } from '../features/activityFeed/state/activityFeedState'
import { sessionReducer, SessionState, AnonUser } from '../features/session/state/sessionState'
import { commitsReducer, CommitsState } from '../features/commits/state/commitState'
import { datasetEditsReducer, DatasetEditsState } from '../features/dataset/state/editDatasetState'
import { WebsocketState, websocketReducer } from '../features/websocket/state/websocketState'
import { UserProfileState, userProfileReducer } from '../features/userProfile/state/userProfileState'
import { eventsReducer, EventsState } from "../features/events/state/eventsState"
import { splashReducer, SplashState } from "../features/splash/state/splashState"
import {
  manualDatasetCreationReducer,
  ManualDatasetCreationState
} from "../features/manualDatasetCreation/state/manualDatasetCreationState"

export const history = createBrowserHistory()

export interface RootState {
  activityFeed: ActivityFeedState
  app: AppState
  collection: CollectionState
  commits: CommitsState
  dataset: DatasetState
  dsPreview: DsPreviewState
  deploy: DeployState
  router: RouterState
  scroller: ScrollerState
  search: SearchState
  session: SessionState
  splash: SplashState
  transfers: RemoteEvents
  userProfile: UserProfileState
  workflow: WorkflowState
  edits: DatasetEditsState
  manualDatasetCreation: ManualDatasetCreationState
  events: EventsState
  websocket: WebsocketState
}

const rootReducer = (h: History) => combineReducers({
  activityFeed: activityFeedReducer,
  app: appReducer,
  collection: collectionReducer,
  commits: commitsReducer,
  dataset: datasetReducer,
  deploy: deployReducer,
  dsPreview: dsPreviewReducer,
  // apparently connected-router's types are no good.
  // https://github.com/reduxjs/redux-toolkit/issues/506#issuecomment-614295927
  // router: connectRouter(h) as any as Reducer<RouterState>,
  router: connectRouter(h),
  scroller: scrollerReducer,
  search: searchReducer,
  session: sessionReducer,
  splash: splashReducer,
  transfers: transfersReducer,
  userProfile: userProfileReducer,
  workflow: workflowReducer,
  edits: datasetEditsReducer,
  manualDatasetCreation: manualDatasetCreationReducer,
  events: eventsReducer,
  websocket: websocketReducer
})

function setAuthState (state: any) {
  try {
    if (state.session.token) {
      localStorage.setItem('state.auth.token', JSON.stringify((state.session || {}).token))
      localStorage.setItem('state.auth.refreshToken', JSON.stringify((state.session || {}).refreshToken))
    } else {
      localStorage.removeItem('state.auth.token')
      localStorage.removeItem('state.auth.refreshToken')
    }

    if (state.session.token && (state.session.token !== AnonUser)) {
      localStorage.setItem('state.auth.user', JSON.stringify((state.session || {}).user))
    } else {
      localStorage.removeItem('state.auth.user')
    }
  } catch (err) { return undefined }
}

export function configureStore (preloadedState?: any) {
  const composeEnhancer: typeof compose = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  const store = createStore(
    rootReducer(history),
    preloadedState,
    composeEnhancer(
      applyMiddleware(
        thunk,
        routerMiddleware(history),
        apiMiddleware,
        websocketMiddleware as any
      )
    )
  )

  // automatically sync store.session.token with localstorage
  store.subscribe(() => {
    setAuthState(store.getState())
  })

  // // Hot reloading
  // if (module.hot) {
  //   // Enable Webpack hot module replacement for reducers
  //   module.hot.accept('./reducers', () => {
  //     store.replaceReducer(rootReducer(history));
  //   });
  // }

  return store
}

// export type RootState = ReturnType<typeof store.getState>;
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export type AppThunk<ReturnType = void> = ThunkAction<
ReturnType,
RootState,
unknown,
Action<string>
>
