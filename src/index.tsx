import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import './index.css'
import App from './features/app/App'
import { configureStore } from './store/store'
import * as serviceWorker from './serviceWorker'
import { getAppExecMode } from './execution/execution'

// API_EXEC_MODE is a global, unique constant for determining which "execution mode" the app is running under (local, desktop, or cloud)
export const APP_EXEC_MODE = getAppExecMode(process.env.REACT_APP_EXEC_MODE || "LOCAL")

ReactDOM.render(
  <React.StrictMode>
    <Provider store={configureStore()}>
      <div className='z-20 bg-qrinavy-900' style={{ padding: 10, paddingLeft: 18 }}>
        <div style={{ margin: 'auto' }}>
          <a href="https://qri.io/winding_down" style={{ color: '#efefef', fontWeight: 'bold' }}>Qri is winding down.</a>
        </div>
      </div>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
