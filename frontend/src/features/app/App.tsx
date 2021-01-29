import React, { useEffect } from 'react';
import { ConnectedRouter } from 'connected-react-router'
import { useDispatch } from 'react-redux';
import ReactTooltip from 'react-tooltip'

import { history } from '../../store/store'
import Routes from '../../routes'
import Modal from './Modal'
import { wsConnect } from '../websocket/middleware/websocket'

import './App.css';

const App: React.FC<any> = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(wsConnect())
    // this "wires up" all of the tooltips, must be called on update, as tooltips
    // in descendents can come and go
    ReactTooltip.rebuild()
  })



  return (
    <div id='app' className='flex flex-col h-screen'>
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
      <ReactTooltip
        id='global'
        place='bottom'
        type='dark'
        effect='solid'
        delayShow={50}
        multiline
      />
    </div>
  );
}

export default App;
