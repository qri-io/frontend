import React from 'react'
import { Link } from 'react-router-dom'

const Run: React.FC<any> = () => {
  return (
    <div className='text-left p-10'>
      <h1 className='text-black font-bold text-3xl'>Run Transform</h1>
      <br />
      <div className='w-16 text-lg text-bold flex flex-col'>
        <div>
          <Link to='/'>
            <h5>Setup</h5>
          </Link>
        </div>
        <div>
          <Link to='/'>
            <h5>Download</h5>
          </Link>
        </div>
        <div>
          <Link to='/'>
            <h5>Transform</h5>
          </Link>
        </div>
        <div>
          <Link to='/'>
            <h5>Save</h5>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Run;
