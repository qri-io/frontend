import React from 'react'

import NavBar from '../navbar/NavBar'

export interface PageLayoutProps {
}

const Page: React.FC<PageLayoutProps> = ({ children }) => (
  <div className='flex flex-col h-full'>
    <NavBar />
    <div className='flex-grow overflow-y-scroll bg-white'>
      {children}
    </div>
  </div>
)

export default Page
