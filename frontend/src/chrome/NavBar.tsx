import React from 'react';
import { Link } from 'react-router-dom'

const NavBar: React.FC<any> = ({ qriRef }) => {
  const { username, name } = qriRef
  return (
    <div className='bg-gray-600 text-white text-bold flex p-4'>
      <Link className='px-1 font-bold' to='/'>...</Link>
      <div className='w-10'></div>
      <div className='font-semibold text-lg'>{username}/{name}</div>
    </div>
  )
}

export default NavBar
