import React from 'react';

export type ButtonType = 'primary'
  | 'light'
  | 'danger'
  | 'dark'

export interface ButtonProps {
  onClick?: () => void
  type?: ButtonType
  size?: 'md' | 'lg'
  className?: string
}

const Button: React.FC<ButtonProps> = ({
  type='primary',
  size='md',
  className,
  onClick,
  children
}) => {

  // primary type
  let colorClasses = 'text-white bg-qriblue-600 hover:bg-qriblue-700 focus:ring-qriblue-500'
  let sizeClasses = 'text-sm px-4 py-2'

  switch(type) {
    case 'light':
      colorClasses = 'text-gray-700 hover:bg-gray-50 border border-gray-300 focus:ring-indigo-500'
      break
    case 'dark':
      colorClasses = 'text-white bg-qrinavy-400 hover:bg-qrinavy-500  focus:ring-qrinavy-400'
      break
    case 'danger':
      colorClasses = 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500'
      break
  }

  switch(size) {
    case 'lg':
      sizeClasses = 'text-md px-8 py-3'
      break
  }

  return (
    <button
      type="button"
      className={`flex items-center inline-flex justify-center rounded-sm shadow-sm bg-white font-medium focus:outline-none focus:ring focus:ring-offset ring-offset-transparent mt-0 w-auto transition-all duration-100 ${colorClasses} ${sizeClasses} ${className}`}
      onClick={onClick}
    >
    { children }
    </button>
  )
}

export default Button
