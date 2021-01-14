import React from 'react';
import { Link } from 'react-router-dom'

const NavBar: React.FC<any> = () => {
  return (
    <div className='bg-gray-600 text-white text-bold flex p-2'>
      <Link className='px-1 font-bold' to='/'>Qrimatic</Link>
      <div className='w-10'></div>
      <Link className='px-1' to='/collection'>Collection</Link>
      <Link className='px-1' to='/notifications'>Notifications</Link>
      <Link className='px-1' to='/ds/new'>New Workflow</Link>
    </div>
  )
}

export default NavBar
