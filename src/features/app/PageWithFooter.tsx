import React from 'react'

import NavBar from '../navbar/NavBar'
import Footer from '../footer/Footer'

export interface PageLayoutProps {
}

const Page: React.FC<PageLayoutProps> = ({ children }) => (
  <div className='flex flex-col h-full'>
    <NavBar />
    <div className='flex-grow overflow-y-hidden bg-white'>
      {children}
    </div>
    <Footer />
  </div>
)

export default Page
