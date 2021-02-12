import React from 'react'

import UserNavBar from '../navbar/UserNavBar'
import AppNavItems from '../navbar/AppNavItems'


export interface UserPageLayoutProps {}

const PageLayout: React.FC<UserPageLayoutProps> = ({ children }) => (
  <div className='flex flex-col h-full bg-gray-100'>
    <UserNavBar>
      <AppNavItems />
    </UserNavBar>
    <div className='flex-grow overflow-y-scroll bg-white'>
      {children}
    </div>
  </div>
)

export default PageLayout
