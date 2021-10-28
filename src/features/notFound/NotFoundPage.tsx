import React from 'react'

import Button from '../../chrome/Button'
import Link from '../../chrome/Link'
import Footer from '../footer/Footer'

const NotFoundPage = () => (
  <>
    <div className='border-t border-b border-qrigray-200' style={{
      backgroundColor: 'white',
      backgroundImage: 'url("/img/404/dot.svg")'
    }}>
      <div className='overflow-y-hidden relative'>
        <img src='/img/404/yellow-aura.svg' className='absolute top-10 -left-48 z-0' alt='a background shape'/>
        <div className='px-5 md:px-10 lg:px-20 z-10 relative mb-16'>
          <div className='flex flex-col md:flex-row'>
            <div className='w-full md:w-1/2 my-30 flex items-center'>
              <div className='max-w-lg mx-auto'>
                <div className='text-7xl text-qritile-600 font-extrabold'>Lost Blob Alert!</div>
                <div className='text-3xl font-bold mb-6'>Sorry, we can&apos;t find the page you requested</div>
                <Link to='/'><Button type='secondary' className='w-36' size='lg'>Back to Home</Button></Link>
              </div>
            </div>
            <div className='w-full md:w-1/2 pt-10 flex items-center'>
              <img src='/img/404/lost-blob.svg' className='mx-auto' alt='a lost qri blob character looking for directions'/>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
  </>
)

export default NotFoundPage
