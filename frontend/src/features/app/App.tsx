import React, { useEffect } from 'react';
import { ConnectedRouter } from 'connected-react-router'
import { useDispatch } from 'react-redux';

import { history } from '../../store/store'
import Routes from '../../routes'
import NavBar from '../../chrome/NavBar'
import Modal from './Modal'
import { wsConnect } from '../websocket/middleware/websocket'

import './App.css';

const App: React.FC<any> = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(wsConnect())
  })

  return (
    <div className='App'>
      <ConnectedRouter history={history}>
        <Modal />
        <NavBar />
        <Routes />
      </ConnectedRouter>
    </div>
  );
}

export default App;
