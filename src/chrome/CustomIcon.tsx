import React from 'react'
import classNames from 'classnames'

export interface CustomIconProps {
  className?: string
  size?: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  spin?: boolean
}

const CustomIcon: React.FunctionComponent<CustomIconProps> = ({
  className,
  size,
  spin=false,
  children
}) => {
  let dimension = 22

  if (size === '2xs') {
    dimension = 12
  }

  if (size === 'xs') {
    dimension = 14
  }

  if (size === 'sm') {
    dimension = 18
  }

  if (size === 'lg') {
    dimension = 24
  }

  return (
    <svg
      className={classNames(className, {
        'animate-spin-slow': spin
      })}
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
