// IconButton renders an icon that behaves like a button, useful for closing modals with an X,
// or adding things with a +
import React from 'react'
import classNames from 'classnames'

import Icon, { IconSize } from './Icon'

interface IconButtonProps {
  className?: string
  icon: string
  size?: IconSize
  disabled?: boolean
  onClick: () => void
}

const IconButton: React.FC<IconButtonProps> = ({
  className,
  icon,
  size = 'md',
  disabled = false,
  onClick
}) => (
  <div
    className={classNames(
      'transition-all duration-100',
      className,
      {
        'text-qrigray-400 hover:text-qrigray-500 cursor-pointer': !disabled,
        'text-qrigray-200': disabled
      }
    )}
    onClick={onClick}
  >
    <Icon icon={icon} size={size} />
  </div>
)

export default IconButton
