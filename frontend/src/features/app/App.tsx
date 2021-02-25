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
      {/*
        This is a global react-tooltip element for general use in the app.
        Local/specialized implementations are also possible, see SideNavItem
        To add a tooltip to any element, add a data-tip={'tooltip text'} and
        data-for='global' attributes

        See useEffect(), which calls rebuild() to re-bind all tooltipsToolti
      */}
    </div>
  );
}

export default App;
