import React from 'react'

import NavBar, { NavBarProps } from '../navbar/NavBar'
import Footer from '../footer/Footer'
import MobileFooter from '../footer/MobileFooter'

interface ScrollLayoutProps {
  navBarProps?: NavBarProps
}

const ScrollLayout: React.FC<ScrollLayoutProps> = ({ navBarProps, children }) => {
  return (
    <div className='flex flex-col h-full w-full' style={{ backgroundColor: '#f3f4f6' }}>
      <NavBar {...navBarProps}/>
      <div className='flex-grow w-full overflow-y-scroll flex flex-col'>
        {children}
        <div className='bg-white flex-shrink-0 md:hidden'>
          <MobileFooter />
        </div>
      </div>
      <div className='bg-white flex-shrink-0 hidden md:block'>
        <Footer />
      </div>
    </div>
  )
}

export default ScrollLayout
