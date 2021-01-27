import React from 'react';
import AppNavItems from './AppNavItems';
import NavBarMenu, { NavBarMenuItem } from './NavBarMenu';

export interface NavBarProps {
  menu?: NavBarMenuItem[]
}

const NavBar: React.FC<any> = ({ menu = [], children }) => {
  return (
    <div className='bg-gray-800 text-white text-bold flex p-2'>
      {(menu.length > 0) && <NavBarMenu items={menu} />}
      {children
        ? children
        : <AppNavItems />
      }
    </div>
  )
}

export default NavBar
