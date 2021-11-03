import React from 'react'

import NavBar from '../navbar/NavBar'

const Page: React.FC = ({ children }) => (
  <div className='flex flex-col h-full'>
    <NavBar />
    <div className='flex-grow overflow-y-scroll bg-white'>
      {children}
    </div>
  </div>
)

export default Page
