// CloseButton renders an X icon that behaves like a button, useful for closing modals
import React from 'react'
import classNames from 'classnames'

import Icon, { IconSize } from './Icon'

interface CloseButtonProps {
  className?: string
  size?: IconSize
  onClick: () => void
}

const CloseButton: React.FunctionComponent<CloseButtonProps> = ({
  className,
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
    <Icon icon='close' size={size} />
  </div>
)

export default CloseButton
