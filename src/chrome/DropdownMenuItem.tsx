import React from 'react'
import classNames from 'classnames'

import Icon from './Icon'

export const dropdownBaseClass = 'text-left text-xs px-2 py-0.5 mx-2 my-1 whitespace-nowrap rounded-md'

export interface DropdownMenuItemProps {
  active?: boolean
  // label is the text that will be displayed to the user
  label: string | React.ReactElement
  // disabled will show the item, but it will not be clickable
  disabled?: boolean
  // icon: options are found in the `Icon` component
  icon?: string
  // if onClick exists in a DropDownMenuItem, clicking the item will not trigger onChange,
  // and will execute the onClick function
  onClick?: () => void
}

const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({
  label,
  active = false,
  disabled = false,
  icon,
  onClick,
  children
}) => (
  <button
    onClick={() => { onClick && onClick() }}
    className={classNames(dropdownBaseClass, {
      'hover:pointer text-qrigray-400 hover:bg-gray-100': !disabled,
      'text-qrigray-300': disabled
    })}
    role="menuitem"
  >
    {(typeof label === 'string')
      ? <span className={classNames({'text-qripink font-semibold': active })}>
          {icon && <Icon icon={icon} className='mr-2' size='sm' />}{label}
        </span> 
      : label}
  </button>
)

export default DropdownMenuItem
