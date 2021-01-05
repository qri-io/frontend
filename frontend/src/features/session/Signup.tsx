import React from 'react'
import { Link } from 'react-router-dom';

const Signup: React.FC<any> = () => {
  return (
    <div className='p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md space-x-4 text-left'>
      <h1 className='text-xl font-bold'>Signup</h1>
      <p>email</p>
      <input className='bg-gray-100 border-gray-200 rounded-md' type='text' />
      <p>password</p>
      <input className='bg-gray-100 border-gray-200 rounded-md' type='password' />
      <br />
      <Link to='/run'>
        <div className='py-2 px-4 font-semibold rounded-lg shadow-md text-white bg-gray-600 hover:bg-gray-300'>
          <p>Signup</p>
        </div>
      </Link>
    </div>
  )
}

export default Signup;
