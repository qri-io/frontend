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
  isLink?: boolean
  exact?: boolean
}

const DatasetSideNavItem: React.FC<DatasetSideNavItemProps> = ({
  id,
  icon,
  label,
  to,
  expanded=true,
  tooltip,
  number,
  disabled = false,
  isLink = true,
  exact = false,
}) => {
  const { pathname } = useLocation();


  const isActive = (): boolean => {
    if (exact) {
      return pathname === to
    }
    const clearedTo = to.split('#')[0]
    if (pathname.includes(clearedTo)) {
      return true
    }
    let splitToUrl = clearedTo.split('/')
    let splitPathUrl = pathname.split('/')
    if (splitToUrl.length === 2 && splitPathUrl.length === 2) {
      return false
    }
    if (splitToUrl[0] === splitPathUrl[0] && splitToUrl[1] === splitPathUrl[1] &&
      splitToUrl[splitToUrl.length - 1] === splitPathUrl[splitPathUrl.length - 1]){
      return true
    }
    return false
  }

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
            width: expanded ? 'auto' : 0,
            // inline-block is necessary here so that the tooltip appears just to the right of the text
            display: expanded ? 'inline-block' : 'none'
          }} className='font-bold text-sm'>{label}</span>
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
        {isLink ?
          <Link id={id+'_link'} to={to} className={classNames('font-medium text-black transition-100 transition-all hover:text-qripink', {
            'text-qripink': isActive()
          })}>
            {content}
          </Link> :
          <span id={id+'_link'} className={classNames('cursor-pointer font-medium text-black transition-100 transition-all hover:text-qripink', {
            'text-qripink': isActive()
          })}>
            {content}
          </span>
        }
      </div>
      <br/>
    </>
  )
}

export default DatasetSideNavItem
