import React from 'react';
import { ConnectedRouter } from 'connected-react-router'

import { history } from './store/store'
import Routes from './routes'
import './App.css';
import NavBar from './chrome/NavBar'

function App() {
  return (
    <div className="App">
      <ConnectedRouter history={history}>
        <NavBar />
        <Routes />
      </ConnectedRouter>
    </div>
  );
}

export default App;
