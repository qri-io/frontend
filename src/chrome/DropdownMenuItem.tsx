import React from 'react'
import classNames from 'classnames'

import Icon from './Icon'
import Link from './Link'

export const dropdownBaseClass = 'text-left my-0.5 px-2 py-1 whitespace-nowrap rounded-sm font-light last:mb-0'

export interface DropdownMenuItemProps {
  active?: boolean
  // label is the text that will be displayed to the user
  label?: string
  // disabled will show the item, but it will not be clickable
  disabled?: boolean
  // icon: options are found in the `Icon` component
  icon?: string
  // element: pass in any react element instead of a label and or icon
  element?: React.ReactElement
  // if onClick exists in a DropDownMenuItem, clicking the item will not trigger onChange,
  // and will execute the onClick function
  onClick?: () => void
  // if to exists the item will render a Link
  to?: string
}

const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({
  label,
  active = false,
  disabled = false,
  icon,
  element,
  onClick,
  to,
}) => {
  const containerClassName = classNames(dropdownBaseClass, {
    'hover:cursor-pointer text-qrigray-400 hover:bg-gray-100': !disabled,
    'text-qrigray-300': disabled
  })

  const colorClassName = 'text-qrigray-400'

  let dropdownMenuItemContent = (
    <div className={classNames({'text-qripink': active })} style={{ fontSize: 11 }}>
      {icon && <Icon icon={icon} className='mr-2' size='sm' />}{label}
    </div>
  )

  if (element) {
    dropdownMenuItemContent = element
  }

  if (to || onClick) {
    return (
      <Link
        to={to}
        onClick={onClick}
        className={containerClassName}
        colorClassName={colorClassName}
      >
        {dropdownMenuItemContent}
      </Link>
    )
  } else if (element) {
    return (
      <>
        {dropdownMenuItemContent}
      </>
    )
  } else {
    return (
      <div className={dropdownBaseClass}>
        {dropdownMenuItemContent}
      </div>
    )
  }

}

export default DropdownMenuItem
