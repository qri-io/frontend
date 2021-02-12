import React from 'react'

import AnonymousNavBar from '../navbar/AnonymousNavBar'

export interface AnonymousPageLayoutProps {}

const AnonymousPageLayout: React.FC<AnonymousPageLayoutProps> = ({ children }) => (
  <div className='flex flex-col h-full bg-gray-100'>
    <AnonymousNavBar />
    <div className='flex-grow overflow-y-scroll bg-white'>
      {children}
    </div>
  </div>
)

export default AnonymousPageLayout
