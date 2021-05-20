import React from 'react';
import classNames from 'classnames';

export type ButtonType = 'primary'
  | 'primary-outline'
  | 'secondary'
  | 'light'
  | 'warning'
  | 'danger'
  | 'dark'

export interface ButtonProps {
  onClick?: () => void
  type?: ButtonType
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const Button: React.FC<ButtonProps> = ({
  type='primary',
  size='md',
  className,
  onClick,
  children
}) => (
  <button
    type="button"
    className={classNames(
      'inline-flex items-center justify-center rounded-md shadow-sm bg-transparent font-medium focus:outline-none focus:ring focus:ring-offset ring-offset-transparent mt-0 transition-all duration-100',
      className,
      {
        'text-sm px-2 h-9 ': (size === 'sm'),
        'text-sm px-4 h-10': (size === 'md'),
        'text-md px-8 py-3': (size === 'lg'),
      },
      {
        'text-white bg-qriblue hover:bg-qriblue-600 focus:ring-qriblue': (type === 'primary'),
        'text-qriblue text-sm font-medium border-2 border-qriblue box-border': (type === 'primary-outline'),
        'text-white bg-qripink-600 hover:bg-qripink-700 focus:ring-qripink-500': (type === 'secondary'),
        'text-gray-700 border border-gray-700 focus:ring-indigo-500': (type === 'light'),
        'text-white bg-qrinavy-400 hover:bg-qrinavy-500 focus:ring-qrinavy-400': (type === 'dark'),
        'text-gray-700 bg-yellow-300 hover:bg-yellow-400 focus:ring-yellow-400': (type === 'warning'),
        'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500': (type === 'danger'),
      }
    )}
    onClick={onClick}
  >
    {children}
  </button>
)

export default Button
