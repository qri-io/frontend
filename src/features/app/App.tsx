import React, { useEffect } from 'react'
import { ConnectedRouter } from 'connected-react-router'
import { useDispatch, useSelector } from 'react-redux'

import { history } from '../../store/store'
import Routes from '../../routes'
import Modal from './modal/Modal'
import { wsConnect } from '../websocket/state/websocketActions'
import SnackBar from '../snackBar/SnackBar'
import ToastRenderer from '../toast/ToastRenderer'

import './App.css'
import { selectSessionTokens } from '../session/state/sessionState'

const App: React.FC<any> = () => {
  const dispatch = useDispatch()

  const tokens = useSelector(selectSessionTokens)
  useEffect(() => {
    dispatch(wsConnect(tokens.token))
  }, [dispatch, tokens.token])

  return (
    <div id='app' className='flex flex-col h-screen w-screen max-w-full' style={{ minWidth: '1100px' }}>
      <ConnectedRouter history={history}>
        <Modal />
        <Routes />
        <SnackBar />
        <ToastRenderer />
      </ConnectedRouter>
    </div>
  )
}

export default App
