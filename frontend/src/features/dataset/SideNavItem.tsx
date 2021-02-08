import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import ReactTooltip from 'react-tooltip'

import Icon from '../../chrome/Icon';

export interface SideNavItemProps {
  id: string;
  icon: string;
  to: string;
  tooltip?: React.ReactNode
}

const SideNavItem: React.FC<SideNavItemProps> = ({ id, icon, to, tooltip }) => {
  const { pathname } = useLocation();
  const active = pathname === to
  return (
      <Link to={to} className=''>
        <div
          className={`text-center h-10 w-10 m-3 rounded py-2 hover:bg-qriblue hover:text-white transition-all duration-200 ${active ? 'bg-qriblue text-white' : 'text-gray-400'}`}
          data-tip
          data-for={id}
        >
          <Icon icon={icon} />
          {tooltip && (
            <ReactTooltip
              id={id}
              place='right'
              effect='solid'
              offset={{
                right: 10
              }}
            >
              {tooltip}
            </ReactTooltip>
          )}
        </div>
      </Link>
  )
}

export default SideNavItem
