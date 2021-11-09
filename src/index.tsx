import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import './index.css'
import App from './features/app/App'
import { configureStore } from './store/store'
import * as serviceWorker from './serviceWorker'
import { getAppExecMode } from './execution/execution'

// API_EXEC_MODE is a global, unique constant for determining which "execution mode" the app is running under (local, desktop, or cloud)
export const APP_EXEC_MODE = getAppExecMode(process.env.APP_EXEC_MODE || "LOCAL")
// DEFAULT_PHOTO_URL is the default profile photo.
// TODO(ramfox): this should be replaced with a component that generates
// an icon based on a username
export const DEFAULT_PROFILE_PHOTO_URL = 'https://qri-user-images.storage.googleapis.com/1570029763701.png'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={configureStore()}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
