import React from 'react'
import classNames from 'classnames'

export interface CustomIconProps {
  className?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const CustomIcon: React.FunctionComponent<CustomIconProps> = ({
  className,
  size,
  children
}) => {
  let dimension = 24

  if (size === 'xs') {
    dimension = 14
  }

  if (size === 'sm') {
    dimension = 18
  }

  if (size === 'lg') {
    dimension = 22
  }

  return (
    <svg
      className={classNames(className)}
      width={dimension}
      height={dimension}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        display: 'inline'
      }}
    >
      {children}
    </svg>
  )
}

export default CustomIcon
