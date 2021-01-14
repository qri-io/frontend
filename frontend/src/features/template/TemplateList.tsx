import React from 'react'
import { Link } from 'react-router-dom'
import { TemplateType } from './templates'

const templates = [
  {
    name: 'CSV Download',
    type: TemplateType.CSVDownload
  },
  {
    name: 'API Call',
    type: TemplateType.APICall
  },
  {
    name: 'Database Query',
    type: TemplateType.DatabaseQuery
  },
  {
    name: 'Web Scrape',
    type: TemplateType.Webscrape
  }
]

const TemplateList: React.FC<any> = () => {
  return (
    <div className='text-left p-10 max-w-screen-md mx-auto'>
      <h1 className='text-black text-xl'>New Dataset</h1>
      <p>Choose a template</p>
      <br />
      <div className='text-lg text-bold flex flex-wrap -mx-2 overflow-hidden'>
        {
          templates.map(({ name, type }) => (
            <div key={name} className='my-2 px-2 overflow-hidden w-full md:w-1/2 lg:w-1/3 xl:w-1/3'>
              <Link to={{ 
                pathname: `/ds/temp/dataset_${Math.floor(Math.random() * 1000)}`,
                state: { template: type }
              }}>
                <div className='border border-gray-300 hover:border-blue-500 rounded bg-white text-sm p-10 text-center'>
                    <h3>{name}</h3>
                </div>
              </Link>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default TemplateList;
