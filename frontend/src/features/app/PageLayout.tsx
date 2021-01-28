import React from 'react'

import NavBar from '../navbar/NavBar'

export interface PageLayoutProps {}

// for non-dataset views, contains Navbar and full-height content area with
//overflow-y-scroll
const PageLayout: React.FC<PageLayoutProps> = ({ children }) => (
  <div className='flex flex-col h-full bg-gray-100'>
    <NavBar />
    <div className='flex-grow overflow-y-scroll bg-white'>
      {children}
    </div>
  </div>
)

export default PageLayout
