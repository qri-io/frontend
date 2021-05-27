import { combineReducers, applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import { ThunkAction, Action } from '@reduxjs/toolkit';
import { connectRouter, routerMiddleware, RouterState } from 'connected-react-router'
import { createBrowserHistory, History } from 'history'

import transfersReducer from '../features/transfer/state/transferState';
import { apiMiddleware } from './api';
import { RemoteEvents, websocketMiddleware } from '../features/websocket/middleware/websocket';
import { workflowReducer, WorkflowState } from '../features/workflow/state/workflowState';
import { AppState, appReducer } from '../features/app/state/appState';
import { CollectionState, collectionReducer } from '../features/collection/state/collectionState';
import { datasetReducer, DatasetState } from '../features/dataset/state/datasetState';
import { scrollerReducer, ScrollerState } from '../features/scroller/state/scrollerState';
import { searchReducer, SearchState } from '../features/search/state/searchState';
import { deployReducer, DeployState } from '../features/deploy/state/deployState';
import { activityFeedReducer, ActivityFeedState } from '../features/activityFeed/state/activityFeedState';
import { sessionReducer, SessionState } from '../features/session/state/sessionState';
import { commitsReducer, CommitsState } from '../features/commits/state/commitState';
import { datasetEditsReducer, DatasetEditsState } from '../features/dataset/state/editDatasetState';
import { WebsocketState, websocketReducer } from '../features/websocket/state/websocketState';

export const history = createBrowserHistory()

export interface RootState {
  activityFeed: ActivityFeedState,
  app: AppState
  collection: CollectionState
  commits: CommitsState
  dataset: DatasetState
  deploy: DeployState
  router: RouterState
  scroller: ScrollerState
  search: SearchState
  session: SessionState
  transfers: RemoteEvents
  workflow: WorkflowState
  edits: DatasetEditsState
  websocket: WebsocketState
}

const rootReducer = (h: History) => combineReducers({
  activityFeed: activityFeedReducer,
  app: appReducer,
  collection: collectionReducer,
  commits: commitsReducer,
  dataset: datasetReducer,
  deploy: deployReducer,
  // apparently connected-router's types are no good.
  // https://github.com/reduxjs/redux-toolkit/issues/506#issuecomment-614295927
  // router: connectRouter(h) as any as Reducer<RouterState>,
  router: connectRouter(h),
  scroller: scrollerReducer,
  search: searchReducer,
  session: sessionReducer,
  transfers: transfersReducer,
  workflow: workflowReducer,
  edits: datasetEditsReducer,
  websocket: websocketReducer
})

export function configureStore(preloadedState?: any) {
  const composeEnhancer: typeof compose = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  const store = createStore(
    rootReducer(history),
    preloadedState,
    composeEnhancer(
      applyMiddleware(
        thunk,
        routerMiddleware(history),
        apiMiddleware,
        websocketMiddleware as any,
      ),
    ),
  )

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
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
