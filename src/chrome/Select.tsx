import React from 'react'

import DropdownMenu from './DropdownMenu'
import Icon from './Icon'

export interface SelectOption {
  label: string
  value: string
}

export interface SelectProps {
  value: string
  options: SelectOption[]
  onChange: (p: string) => void
}

const Select: React.FC<SelectProps> = ({
  value,
  options,
  onChange
}) => {
  const label = (
  <div className='border border-qrigray-300 rounded-lg text-qrigray-400 text-xs font-normal px-2 py-2 cursor-pointer w-full flex items-center'>
    <div className='flex-grow'>{options.find((o) => o.value === value)?.label}</div>
    <Icon icon='caretDown' size='2xs' className='ml-3' />
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
      >
    </DropdownMenu>
  )
}

export default Select
