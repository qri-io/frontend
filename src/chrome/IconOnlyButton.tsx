import React from 'react'
import classNames from 'classnames'

import Icon, { IconSize } from './Icon'
import { ButtonType, generateButtonTypeClasses } from './Button'

export interface IconOnlyButtonProps {
  // icon is required
  icon: string
  id?: string
  className?: string
  // type is the color scheme of the button
  type?: ButtonType
  // there are three sizes of button, default is 'md'
  size?: 'sm' | 'md' | 'lg'
  // submit makes it a form submit button
  submit?: boolean
  // disabled will make the button "grayed out", no pointer on hover, onClick will do nothing
  disabled?: boolean
  // round will increase the border radius to make the IconOnlyButton round
  round?: boolean
  // onClick is a function that will fire when the button is clicked
  onClick?: () => void
}

const IconOnlyButton: React.FC<IconOnlyButtonProps> = ({
  id,
  className,
  type='primary',
  icon,
  size='md',
  submit = false,
  disabled = false,
  round = false,
  onClick= () => {},
}) => {
  let dimension = 26
  let iconSize: IconSize = 'xs'
  let borderRadius = round ? 56.5 : 4.5

  if (size === 'md') {
    dimension = 36
    iconSize = 'sm'
    borderRadius = round ? 78.3 : 6.26
  } else if (size === 'lg') {
    dimension = 46
    iconSize = 'md'
    borderRadius = round ? 100 : 8
  }

  return (
    <button
      id={id}
      type={submit ? 'submit' : 'button'}
      style={{
        height: dimension,
        width: dimension,
        borderRadius
      }}
      className={classNames(
        'inline-flex items-center justify-center shadow-sm bg-transparent font-semibold focus:outline-none focus:ring-none mt-0 transition-all duration-100',
        className,
        generateButtonTypeClasses(type, disabled)
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon icon={icon} size={iconSize}/>
    </button>
  )
}

export default IconOnlyButton
