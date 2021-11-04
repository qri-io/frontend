import React from 'react'
import classNames from 'classnames'

export interface CustomIconProps {
  className?: string
  size?: '3xs' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  spin?: boolean
  rotation?: 90 | 180 | 270
}

const CustomIcon: React.FunctionComponent<CustomIconProps> = ({
  className,
  size = 'md',
  spin = false,
  children,
  rotation
}) => {
  let dimension: number

  switch (size) {
    case '3xs':
      dimension = 10
      break
    case '2xs':
      dimension = 12
      break
    case 'xs':
      dimension = 14
      break
    case 'sm':
      dimension = 18
      break
    case 'md':
      dimension = 22
      break
    case 'lg':
      dimension = 24
      break
    default: // 'md'
      dimension = 22
      break
  }

  return (
    <svg
      className={classNames(className, {
        'animate-spin-slow': spin
      })}
      width={dimension}
      height={dimension}
      transform={rotation && `rotate(${rotation})`}
      viewBox={`0 0 24 24`}
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
