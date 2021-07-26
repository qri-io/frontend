import React from 'react'
import Icon from '../../chrome/Icon'
import classNames from 'classnames'

export interface CheckboxProps {
  label?: string
  value: boolean
  onChange: () => void
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  value,
  onChange
}) => (
  <div className='cursor-pointer flex items-center' onClick={onChange}>
    <Icon icon={value ? 'checkboxChecked' : 'checkbox'} className={classNames('mr-2', {
      'text-qripink': value,
      'text-qrigray': !value
    })} />
    {label && (<div className='text-xs'>{label}</div>)}
  </div>
)

export default Checkbox
