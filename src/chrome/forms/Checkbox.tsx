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
    })} />
    {label && (<div className='text-sm'>{label}</div>)}
  </div>
)

export default Checkbox
