import React from 'react'
import { Link, useLocation } from 'react-router-dom';

import Icon from '../../chrome/Icon';

export interface SideNavItemProps {
  icon: string;
  to: string;
}

const SideNavItem: React.FC<SideNavItemProps> = ({ icon, to }) => {
  const { pathname } = useLocation();
  const active = pathname === to
  return (
      <Link to={to} className=''>
        <div className={`text-gray-500 text-center h-10 w-10 m-3 rounded py-2 hover:bg-gray-300 transition-all duration-200 ${active && 'bg-gray-300'}`}>
          <Icon icon={icon} />
        </div>
      </Link>
  )
}

export default SideNavItem
