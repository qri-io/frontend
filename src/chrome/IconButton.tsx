// IconButton renders an icon that behaves like a button, useful for closing modals with an X,
// or adding things with a +
import React from 'react'
import classNames from 'classnames'

import Icon, { IconSize } from './Icon'

interface IconButtonProps {
  className?: string
  icon: string
  size?: IconSize
  onClick: () => void
}

const IconButton: React.FunctionComponent<IconButtonProps> = ({
  className,
  icon,
  size = 'md',
  onClick
}) => (
  <div
    className={classNames(
      'cursor-pointer text-qrigray-400 hover:text-qrigray-500 transition-all duration-100',
      className
    )}
    onClick={onClick}
  >
    <Icon icon={icon} size={size} />
  </div>
)

export default IconButton
