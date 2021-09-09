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
  number?: number
  disabled?: boolean
}

const DatasetSideNavItem: React.FC<DatasetSideNavItemProps> = ({
  id,
  icon,
  label,
  to,
  expanded=true,
  tooltip,
  number,
  disabled = false
}) => {
  const { pathname } = useLocation();
  const active = pathname.includes(to)

  let numberContent

  if (number && (number > 0)) {
    numberContent = (
      <div
        className='text-center bg-qrigray-400 px-1 py-0.5 rounded-sm text-white leading-none absolute -top-0 right-1'
        style={{
          fontSize: 9
        }}
      >{number}</div>
    )
  }

  const content = (
    <>
      <span data-tip data-for={id}>
        <div className='flex items-center'>
          <div className='relative'>
            {numberContent}
            <Icon className='mr-2' size='md' icon={icon} />
          </div>
          <span style={{
            fontSize: '16px',
            width: expanded ? 'auto' : 0,
            // inline-block is necessary here so that the tooltip appears just to the right of the text
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
            right: 20
          }}
        >
          {tooltip}
        </ReactTooltip>
      )}
    </>
  )

  if (disabled) {
    return (
      <>
        <div className='mb-4 inline-block h-6'>
          <div className='font-medium text-qrigray-300 cursor-pointer'>
            {content}
          </div>
        </div>
        <br/>
      </>
    )
  }

  return (
    <>
      <div className='mb-4 inline-block h-6'>
        <Link id={id+'_link'} to={to} className={classNames('font-medium text-qrinavy transition-100 transition-all hover:text-qripink', {
          'text-qripink': active
        })}>
          {content}
        </Link>
      </div>
      <br/>
    </>
  )
}

export default DatasetSideNavItem
