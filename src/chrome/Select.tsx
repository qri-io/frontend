import React from 'react'
import classNames from 'classnames'

import DropdownMenu from './DropdownMenu'
import Icon from './Icon'

export interface SelectOption {
  label: string
  value: string
}

export interface SelectProps {
  value: string
  options: SelectOption[]
  fullWidth?: boolean
  size?: 'sm' | 'md'
  onChange: (p: string) => void
}

const Select: React.FC<SelectProps> = ({
  value,
  options,
  fullWidth = false,
  size = 'md',
  onChange
}) => {
  const label = (
    <div
      className={classNames('border border-qrigray-300 text-qrigray-400 text-xs font-normal cursor-pointer w-full flex items-center focus:border-qripink', {
        'rounded-lg p-2': size === 'md',
        'rounded px-2': size === 'sm'
      })}
      tabIndex={0}
      style={{
        fontSize: size === 'sm' ? 8 : '',
        height: size === 'sm' ? 25 : '',
        lineHeight: size === 'sm' ? '25px' : ''
      }}
    >
      <div className='flex-grow'>{options.find((o) => o.value === value)?.label}</div>
      <Icon icon='caretDown' size={size === 'md' ? '2xs' : '3xs'} className='ml-3' />
    </div>)

  return (
    <DropdownMenu
      icon={label}
      alignLeft
      items={options.map((option) => {
        return {
          ...option,
          active: value === option.value,
          onClick: () => { onChange(option.value) }
        }
      })}
      fullWidth={fullWidth}
    >
    </DropdownMenu>
  )
}

export default Select
