import { combineReducers, applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import { ThunkAction, Action } from '@reduxjs/toolkit';
import { connectRouter, routerMiddleware, RouterState } from 'connected-react-router'
import { createBrowserHistory, History } from 'history'
import { JobState, jobsReducer } from '../features/job/state/jobState';
import { apiMiddleware } from './api'

export const history = createBrowserHistory()

export interface RootState {
  router: RouterState
  jobs: JobState
}

const rootReducer = (h: History) => combineReducers({
  // apparently connected-router's types are no good.
  // https://github.com/reduxjs/redux-toolkit/issues/506#issuecomment-614295927
  // router: connectRouter(h) as any as Reducer<RouterState>, 
  router: connectRouter(h), 
  jobs: jobsReducer,
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
        apiMiddleware
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

