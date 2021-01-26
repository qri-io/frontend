import React from 'react'
import { Link } from 'react-router-dom'

const Splash: React.FC<any> = () => {
  return (
    <div className='py-6 px-6 text-left'>
      <h1 className='text-xl font-medium text-black'>Automate Your Data.</h1>

      <div className='max-w-small'>
        <Link to='/ds/new'>
          <div className='py-2 px-4 font-semibold rounded-lg shadow-md text-white bg-gray-600 hover:bg-gray-300'>
            <p>Create A Dataset</p>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Splash;
