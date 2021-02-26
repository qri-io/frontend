import React from 'react'
import { Link } from 'react-router-dom'

import NavBar from '../navbar/NavBar'

const templates = [
  {
    name: 'CSV Download',
    id: 'CSVDownload'
  },
  {
    name: 'API Call',
    id: 'APICall'
  },
  {
    name: 'Database Query',
    id: 'DatabaseQuery'
  },
  {
    name: 'Web Scrape',
    id: 'Webscrape'
  }
]

const TemplateList: React.FC<any> = () => {
  return (
    <div className='flex flex-col h-full bg-gray-100'>
      <NavBar />
      <div className='max-w-screen-xl mx-auto px-10 py-20'>
        <header className='mb-8'>
          <h1 className='text-2xl font-extrabold'>Choose a Dataset Template</h1>
        </header>
        <p>Each template contains starter code for a common data update technique.  Choose the best fit and start customizing your new dataset workflow.</p>
        <br />
        <div className='text-lg text-bold flex flex-wrap -mx-2 overflow-hidden'>
          {
            templates.map(({ name, id }) => (
              <div key={name} className='my-2 px-2 overflow-hidden w-full md:w-1/2 lg:w-1/3 xl:w-1/3'>
                <Link id={id} to={{
                  pathname: `/ds/me/dataset_${Math.floor(Math.random() * 1000)}/workflow`,
                  state: { template: id }
                }}>
                  <div className='border border-gray-300 hover:border-blue-500 rounded bg-white text-sm px-10 py-16 text-center'>
                      <div className='font-semibold text-lg'>{name}</div>
                  </div>
                </Link>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default TemplateList;
