import React from 'react';
import classNames from 'classnames';

export type ButtonType = 'primary' // light blue button with white text
  | 'primary-outline' // light blue outline button, thick border
  | 'secondary' // pink button with white text
  | 'warning' // yellow button with dark text
  | 'danger' // red button with white text
  | 'light' // gray outline and text, thin border, e.g. cancel button for modal
  | 'dark' // dark outline and text, thin border, e.g. follow button

export interface ButtonProps {
  onClick?: () => void
  type?: ButtonType
  size?: 'sm' | 'md' | 'lg'
  className?: string
  submit?: boolean
  disabled?: boolean
  id?: string
}

const Button: React.FC<ButtonProps> = ({
  type='primary',
  size='md',
  className,
  onClick= () => {},
  submit = false,
  disabled = false,
  children,
  id = undefined
}) => (
  <button
    id={id}
    type={submit ? 'submit' : 'button'}
    style={{
      fontSize: 11
    }}
    className={classNames(
      'inline-flex items-center justify-center rounded-md shadow-sm bg-transparent font-semibold focus:outline-none focus:ring-none mt-0 transition-all duration-100',
      className,
      {
        'cursor-default bg-opacity-40 hover:bg-opacity-40': disabled
      },
      {
        'text-sm px-2.5 h-9 ': (size === 'sm'),
        'text-sm px-2.5 h-9': (size === 'md'),
        'text-md px-8 py-3': (size === 'lg'),
      },
      {
        'text-white bg-qritile hover:bg-qritile-600': (type === 'primary'),
        'text-qritile hover:text-qritile-600 text-sm font-medium border-2 border-qritile hover:border-qritile-600 box-border': (type === 'primary-outline'),
        'text-white bg-qripink-600 hover:bg-qripink-': (type === 'secondary'),
        'text-qrigray-900 bg-warningyellow hover:bg-warningyellow-600': (type === 'warning'),
        'text-white bg-dangerred hover:bg-dangerred-600': (type === 'danger'),
        'text-qrigray-400 hover:text-qrigray-600 border border-qrigray-400 hover:border-qrigray-600': (type === 'light'),
        'text-qrigray-900 hover:text-qripink border border-qrigray-900 hover:border-qripink': (type === 'dark'),
      }
    )}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
)

export default Button
