import React from 'react'
import classNames from 'classnames'

import Icon from './Icon'
import Link from './Link'

export const dropdownBaseClass = 'text-left text-xs px-2 py-0.5 mx-2 my-1 whitespace-nowrap rounded-md'

export interface DropdownMenuItemProps {
  active?: boolean
  // label is the text that will be displayed to the user
  label: string
  // disabled will show the item, but it will not be clickable
  disabled?: boolean
  // icon: options are found in the `Icon` component
  icon?: string
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
  onClick,
  to,
}) => {
  const containerClassName = classNames(dropdownBaseClass, {
    'hover:cursor-pointer text-qrigray-400 hover:bg-gray-100': !disabled,
    'text-qrigray-300': disabled
  })

  const colorClassName = 'text-qrigray-400'

  return (
    <Link
      to={to}
      onClick={onClick}
      className={containerClassName}
      colorClassName={colorClassName}
    >
      <div className={classNames({'text-qripink font-semibold': active })}>
        {icon && <Icon icon={icon} className='mr-2' size='sm' />}{label}
      </div>
    </Link>
  )
}

export default DropdownMenuItem
