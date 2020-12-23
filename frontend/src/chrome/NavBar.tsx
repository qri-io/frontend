import React from 'react';
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import { wsConnect } from '../features/websocket/middleware/websocket';

const NavBar: React.FC<any> = () => {
  const dispatch = useDispatch()
  return (
    <div>
      <button onClick={() => {
        console.log('firing click handler')
        dispatch(wsConnect()) 
      }}>ConnectWS</button>
      <Link to='/'>Jobs</Link>
      <Link to='/datasets'>Datasets</Link>
    </div>
  )
}

export default NavBar
