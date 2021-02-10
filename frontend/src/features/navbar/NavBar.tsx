import React from 'react';
import AppNavItems from './AppNavItems';

import DropdownMenu, { DropDownMenuItem } from '../../chrome/DropdownMenu'
import Icon from '../../chrome/Icon'


export interface NavBarProps {
  menu?: DropDownMenuItem[]
}

const NavBar: React.FC<any> = ({ menu = [], children }) => {
  return (
    <div className='bg-qrinavy text-white text-bold flex p-4 items-center'>
      {(menu.length > 0) && (
        <div className='relative mr-5 ml-1'>
          <DropdownMenu items={menu} alignLeft>
            <Icon icon='bars' />
          </DropdownMenu>
        </div>
      )}
      <div className="py-2 opacity-0">.</div> {/* forces height */}
      {children
        ? children
        : <AppNavItems />
      }

    </div>
  )
}

export default NavBar
