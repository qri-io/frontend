import React from 'react'

export interface PageLayoutProps {
  top: any
  main: any
}

// for non-dataset views, contains Navbar and full-height content area with
//overflow-y-scroll
const PageLayout: React.FC<PageLayoutProps> = ({ top, main }) => (
  <div className='flex flex-col h-full bg-gray-100'>
    {top}
    <div className='flex-grow overflow-y-scroll bg-white'>
      {main}
    </div>
  </div>
)

export default PageLayout
