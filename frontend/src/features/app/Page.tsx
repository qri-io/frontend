import React from 'react'

import NavBar from '../navbar/NavBar'
import AppNavItems from '../navbar/AppNavItems'


export interface PageLayoutProps {
  hideNavItems?: boolean
}

const Page: React.FC<PageLayoutProps> = ({ hideNavItems, children }) => (
  <div className='flex flex-col h-full bg-gray-100'>
    <NavBar>
      {!hideNavItems && <AppNavItems />}
    </NavBar>
    <div className='flex-grow overflow-y-scroll bg-white'>
      {children}
    </div>
  </div>
)

export default Page
