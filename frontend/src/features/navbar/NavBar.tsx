import React from 'react';
import AppNavItems from './AppNavItems';
import NavBarMenu, { NavBarMenuItem } from './NavBarMenu';

export interface NavBarProps {
  menu?: NavBarMenuItem[]
}

const NavBar: React.FC<any> = ({ menu = [], children }) => {
  return (
    <div className='bg-qriblue text-white text-bold flex p-4 items-center'>
      {(menu.length > 0) && <NavBarMenu items={menu} />}
      <div className="py-2 opacity-0">.</div> {/* forces height */}
      {children
        ? children
        : <AppNavItems />
      }

    </div>
  )
}

export default NavBar
