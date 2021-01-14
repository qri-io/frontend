import React from 'react'
import { Link } from 'react-router-dom'

const templates = [
  {
    name: 'CSV Download',
    type: 'CSVDownload',
    description: 'Download a CSV from a web URL'
  },
  {
    name: 'API Call',
    type: 'APICall',
    description: 'Pull JSON data from a web API'
  },
  {
    name: 'Database Query',
    type: 'DatabaseQuery',
    description: 'Connect to and query a database'
  },
  {
    name: 'Web Scrape',
    type: 'Webscrape',
    description: 'Load a web URL and scrape its content with BeautifulSoup'
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
          templates.map(({ name, type, description }) => (
            <div key={name} className='my-2 px-2 overflow-hidden w-full md:w-1/2 lg:w-1/3 xl:w-1/3'>
              <Link to={{
                pathname: `/ds/me/dataset_${Math.floor(Math.random() * 1000)}`,
                state: { template: type }
              }}>
                <div className='border border-gray-300 hover:border-blue-500 rounded bg-white text-sm px-10 py-6 text-center'>
                    <div className='text-lg font-semibold mb-2'>{name}</div>
                    <div className='text-xs'>{description}</div>
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
