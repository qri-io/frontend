import React from 'react'
import classNames from 'classnames'

import Icon, { IconSize } from './Icon'

export type ButtonType = 'primary' // light blue button with white text
| 'primary-outline' // light blue outline button, thick border
| 'secondary' // pink button with white text
| 'secondary-outline' // pink outline button, thick border
| 'warning' // yellow button with dark text
| 'danger' // red button with white text
| 'light' // gray outline and text, thin border, e.g. cancel button for modal
| 'dark' // dark outline and text, thin border, e.g. follow button

// tailwind classes for each type to be used in classNames()
export function generateButtonTypeClasses (type: ButtonType, disabled: boolean): object {
  return {
    'text-white bg-qritile hover:bg-qritile-600': (type === 'primary'),
    'text-qritile hover:text-qritile-600 border border-qritile hover:border-qritile-600 box-border': (type === 'primary-outline'),
    'text-white bg-qripink-600 hover:bg-qripink-700': (type === 'secondary'),
    'text-qripink-600 hover:text-qripink-700 border border-qripink-600 hover:border-qripink-700 box-border': (type === 'secondary-outline'),
    'text-qrigray-900 bg-warningyellow hover:bg-warningyellow-600': (type === 'warning'),
    'text-white bg-dangerred hover:bg-dangerred-600': (type === 'danger'),
    'text-qrigray-400 hover:text-qrigray-600 border border-qrigray-400 hover:border-qrigray-600': (type === 'light'),
    'text-qrigray-900 hover:text-qripink-600 border border-qrigray-900 hover:border-qripink-600': (type === 'dark'),
    'cursor-default text-white bg-qrigray-400 hover:bg-qrigray-400': (type === 'primary' && disabled),
    'text-qrigray-400 border border-qrigray-400 box-border hover:text-qrigray-400 hover:border-qrigray-400': (type === 'primary-outline' && disabled),
    'text-white bg-qrigray-400 hover:bg-qrigray-400': ((type === 'secondary' || type === 'danger') && disabled),
    'text-qrigray-400 hover:text-qrigray-400 border border-qrigray-400 hover:border-qrigray-400 box-border': (type === 'secondary-outline' && disabled),
    'text-qrigray-400 bg-qrigray-400 hover:bg-qrigray-400': (type === 'warning' && disabled),
    'text-qrigray-400 hover:text-qrigray-400 border border-qrigray-400 hover:border-qrigray-400': (type === 'light' && disabled),
    'text-qrigray-400 hover:text-qripink-600 border border-qrigray-400 hover:border-qrigray-400': (type === 'dark' && disabled),
    'cursor-default': disabled
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
  // default is 'md'
  // 'xs' is the button used in the automation sidebar
  size?: 'xs' | 'sm' | 'md' | 'lg'
  // submit makes it a form submit button
  submit?: boolean
  // disabled will make the button "grayed out", no pointer on hover, onClick will do nothing
  disabled?: boolean
  // block will make the button full width and with slightly larger border radii
  block?: boolean
  // caret will add a small caretRight icon to the right of the children
  caret?: boolean
  // style extends the button's style attribute. Useful for providing a static width when button contents will change
  style?: Record<string, any>
  // onClick is a function that will fire when the button is clicked
  onClick?: (e: React.MouseEvent<Element, MouseEvent>) => void
}

const Button: React.FC<ButtonProps> = ({
  id,
  className,
  type = 'primary',
  icon,
  size = 'md',
  submit = false,
  disabled = false,
  block = false,
  caret = false,
  style,
  onClick = () => {},
  children
}) => {
  let height = 32
  let sizeClassName = 'rounded-md px-2.5'
  let caretSize: IconSize = '2xs'

  if (size === 'xs') {
    height = 30
    sizeClassName = 'rounded px-2.5 text-xs'
    caretSize = '3xs'
  } else if (size === 'sm') {
    height = 30
    sizeClassName = 'rounded px-2.5'
    caretSize = '3xs'
  } else if (size === 'lg') {
    height = 38
    sizeClassName = 'rounded-lg text-base'
    caretSize = 'xs'
  }

  // when block is true, the heights and border radii are modified
  if (block) {
    sizeClassName = 'w-full rounded-xl'
    if (size === 'xs') {
      sizeClassName = 'w-full'
    } else if (size === 'sm') {
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
        height,
        lineHeight: height.toString() + 'px',
        ...style
      }}
      className={classNames(
        'px-2.5 inline-flex items-center justify-center shadow-sm bg-transparent font-semibold focus:outline-none focus:ring-none mt-0 transition-all duration-100',
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
