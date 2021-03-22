import React, { useEffect } from 'react';
import { ConnectedRouter } from 'connected-react-router'
import { useDispatch } from 'react-redux';

import { history } from '../../store/store'
import Routes from '../../routes'
import Modal from './modal/Modal'
import { wsConnect } from '../websocket/middleware/websocket'

import './App.css';

const App: React.FC<any> = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(wsConnect())
  })

  return (
    <div id='app' className='flex flex-col h-screen w-screen'>
      <ConnectedRouter history={history}>
        <Modal />
        <Routes />
      </ConnectedRouter>
    </div>
  );
}

export default App;
