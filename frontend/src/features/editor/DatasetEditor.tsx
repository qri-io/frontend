import React from 'react'
import { Link } from 'react-router-dom';

const DatasetEditor: React.FC<any> = () => {
  return (
    <div className='w-max h-max text-left flex'>
      <div>
        <h3>Workflow Steps</h3>
      </div>
      <div>
        <Link to='/signup'>
          <button className='py-2 px-4 font-semibold rounded-lg shadow-md text-white bg-gray-600 hover:bg-gray-300'>Run</button>
        </Link>
        <textarea className='bg-gray-900 text-white font-mono' value='def transform(ds,ctx):' />
      </div>
    </div>
  )
}

export default DatasetEditor;
