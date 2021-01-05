import React from 'react'
import { Link } from 'react-router-dom'

const TemplateList: React.FC<any> = () => {
  return (
    <div className='text-left p-10'>
      <h1 className='text-black text-xl'>New Dataset</h1>
      <p>Choose a template:</p>
      <br />
      <div className='w-16 text-lg text-bold flex flex-col'>
        <div>
          <Link to='/datasets/edit'>
            <h3>API Call</h3>
          </Link>
        </div>
        <br />
        <div>
          <Link to='/datasets/edit'>
            <h3>Database Query</h3>
          </Link>
        </div>
        <br />
        <div>
          <Link to='/datasets/edit'>
            <h3>Web Scrape</h3>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default TemplateList;
