import React from 'react';
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import { wsConnect } from '../features/websocket/middleware/websocket';

const NavBar: React.FC<any> = () => {
  const dispatch = useDispatch()
  return (
    <div className='bg-gray-600 text-white text-bold flex p-2'>
      <Link className='px-1 font-bold' to='/'>Qrimatic</Link>
      <div className='w-10'></div>
      <button className='text-gray-500' onClick={() => { dispatch(wsConnect()) }}>ConnectWS</button>
      <Link className='px-1' to='/jobs'>Collection</Link>
      <Link className='px-1' to='/notifications'>Notifications</Link>
    </div>
  )
}

export default NavBar
