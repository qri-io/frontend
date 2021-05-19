import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
import classNames from 'classnames'

import Icon from '../../chrome/Icon'

export interface DatasetSideNavItemProps {
  id: string
  icon: string
  label: string
  to: string
  expanded: boolean
  tooltip?: React.ReactNode
}

const DatasetSideNavItem: React.FC<DatasetSideNavItemProps> = ({ id, icon, label, to, expanded=true, tooltip }) => {
  const { pathname } = useLocation();
  const active = pathname.includes(to)
  return (
    <div className='mb-4'>
      <Link to={to} className={classNames('font-medium text-qrinavy transition-100 transition-all hover:text-qripink', {
        'text-qripink': active
      })}>
        <span data-tip data-for={id}>
          <div className='flex'>
            <Icon className='mr-2' size='md' icon={icon} />
            <span style={{
              fontSize: '16px',
              width: expanded ? 'auto' : 0,
              display: expanded ? 'inline-block' : 'none'
            }}>{label}</span>
          </div>
        </span>
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
      </Link>
    </div>
  )
}

export default DatasetSideNavItem
