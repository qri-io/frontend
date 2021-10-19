import React from 'react'
import classNames from 'classnames'

import Icon, { IconSize } from './Icon'

export type ButtonType = 'primary' // light blue button with white text
  | 'primary-outline' // light blue outline button, thick border
  | 'secondary' // pink button with white text
  | 'secondary-outline' //pink outline button, thick border
  | 'warning' // yellow button with dark text
  | 'danger' // red button with white text
  | 'light' // gray outline and text, thin border, e.g. cancel button for modal
  | 'dark' // dark outline and text, thin border, e.g. follow button

  // tailwind classes for each type to be used in classNames()
  export function generateButtonTypeClasses(type: ButtonType, disabled: boolean): object {
    return  {
      'text-white bg-qritile hover:bg-qritile-600': (type === 'primary'),
      'text-qritile hover:text-qritile-600 text-sm border border-qritile hover:border-qritile-600 box-border': (type === 'primary-outline'),
      'text-white bg-qripink-600 hover:bg-qripink-': (type === 'secondary'),
      'text-qripink-600 hover:text-qripink-700 text-sm border border-qripink-600 hover:border-qripink-700 box-border': (type === 'secondary-outline'),
      'text-qrigray-900 bg-warningyellow hover:bg-warningyellow-600': (type === 'warning'),
      'text-white bg-dangerred hover:bg-dangerred-600': (type === 'danger'),
      'text-qrigray-400 hover:text-qrigray-600 border border-qrigray-400 hover:border-qrigray-600': (type === 'light'),
      'text-qrigray-900 hover:text-qripink border border-qrigray-900 hover:border-qripink': (type === 'dark'),
      'cursor-default bg-opacity-40 hover:bg-opacity-40': disabled
    }
  }

export interface ButtonProps {
  id?: string
  className?: string
  // type is the color scheme of the button
  type?: ButtonType
  // if icon is present, the button will be slightly taller than normal and will
  // have an icon to the left of the children
  icon?: string
  // there are three sizes of button, default is 'md'
  size?: 'sm' | 'md' | 'lg'
  // submit makes it a form submit button
  submit?: boolean
  // disabled will make the button "grayed out", no pointer on hover, onClick will do nothing
  disabled?: boolean
  // block will make the button full width and with slightly larger border radii
  block?: boolean
  // caret will add a small caretRight icon to the right of the children
  caret?: boolean
  // onClick is a function that will fire when the button is clicked
  onClick?: () => void
}

const Button: React.FC<ButtonProps> = ({
  id,
  className,
  type='primary',
  icon,
  size='md',
  submit = false,
  disabled = false,
  block = false,
  caret = false,
  onClick= () => {},
  children,
}) => {
  let fontSize = 12
  let height = 32
  let sizeClassName = 'rounded-md px-2.5'
  let caretSize: IconSize = '2xs'

  if (size === 'sm') {
    fontSize = 10
    height = 30
    sizeClassName = 'rounded px-2.5'
    caretSize = '3xs'
  } else if (size === 'lg') {
    fontSize = 14
    height = 38
    sizeClassName = 'rounded-lg px-8'
    caretSize = 'xs'
  }

  // when block is true, the heights and border radii are modified
  if (block) {
    sizeClassName = 'w-full rounded-xl'
    if (size === 'sm') {
      height = 26
    } else if (size === 'md') {
      height = 36
    } else if (size === 'lg') {
      height = 46
    }
  }

  // when an icon prop is present, the height of each size is slightly higher
  let iconSize: IconSize = 'xs'

  if (icon) {
    if (size === 'sm') {
      height = 23
    } else if (size === 'md') {
      iconSize = 'sm'
      height = 38
    } else if (size === 'lg') {
      iconSize = 'md'
      height = 44
    }
  }

  return (
    <button
      id={id}
      type={submit ? 'submit' : 'button'}
      style={{
        fontSize,
        height
      }}
      className={classNames(
        'inline-flex items-center justify-center shadow-sm bg-transparent font-semibold focus:outline-none focus:ring-none mt-0 transition-all duration-100',
        sizeClassName,
        className,
        generateButtonTypeClasses(type, disabled)
      )}
      onClick={onClick}
      disabled={disabled}
    >
      { icon && <Icon icon={icon} size={iconSize} className={children ? 'mr-2' : ''}/>}
      {children}
      {caret && <Icon icon='caretRight' size={caretSize} className='ml-2'/>}
    </button>
  )
}



export default Button
