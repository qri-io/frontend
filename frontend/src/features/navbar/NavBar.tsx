import React from 'react';
import { Link } from 'react-router-dom'
import DropdownMenu from '../../chrome/DropdownMenu'
import Icon from '../../chrome/Icon'

import SessionUserMenu from './SessionUserMenu'
import { DatasetMenuItem } from '../dataset/Dataset'

export interface NavBarProps {
  menuItems?: DatasetMenuItem[]
}

const NavBar: React.FC<NavBarProps> = ({ menuItems, children }) => {
  let brandContent = <Link className='px-1 font-bold text-lg tracking-tight' to='/dashboard'>Qrimatic</Link>

  if (menuItems) {
    brandContent = (
      <div className='relative mr-5 ml-1'>
        <DropdownMenu items={menuItems} alignLeft>
          <Icon icon='bars' />
        </DropdownMenu>
      </div>
    )
  }

  return (
    <div className='bg-qrinavy text-white text-bold flex p-4 items-center'>
      {brandContent}
      <div className="py-2 opacity-0">.</div> {/* forces height */}
      {children}
      <div className='flex ml-auto items-center'>
        <SessionUserMenu />
      </div>
    </div>
  )
}

export default NavBar
