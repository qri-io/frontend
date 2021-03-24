import React from 'react';
import { Link } from 'react-router-dom'

import SessionUserMenu from './SessionUserMenu'
import SearchBox from '../search/SearchBox';
import QriLogo from '../../chrome/QriLogo';
import ButtonGroup from '../../chrome/ButtonGroup';

export interface NavBarProps {
  minimal?: boolean
}

const NavBar: React.FC<NavBarProps> = ({ minimal = false }) => {
  return (
    <div className='bg-white text-qrinavy-700 text-bold flex p-4 items-center'>
      <Link className='mr-5' to='/'><QriLogo /></Link>
      {!minimal && <SearchBox />}
      <div className='flex m-auto items-center'>
        {!minimal && <ButtonGroup items={[
          { text: 'Dashboard', link: '/dashboard', icon: 'home'},
          { text: 'Collection', link: '/collection', icon: 'list'},
          { text: 'Activity Feed', link: '/activity', icon: 'bolt'},
        ]} />}
      </div>
      <SessionUserMenu />
    </div>
  )
}

export default NavBar
