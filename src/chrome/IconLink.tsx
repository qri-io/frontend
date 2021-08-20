import React from 'react'
import classNames from 'classnames'
import Link from './Link'
import Icon, { IconSize } from './Icon'

interface IconLinkProps {
  icon: string
  link?: string
  size?: IconSize
  className?: string
  onClick?: () => void
}

const IconLink: React.FC<IconLinkProps> = ({
  icon,
  link,
  size='sm',
  className,
  onClick
}) => {
  const linkClassNames = 'text-qrinavy hover:text-qripink hover:cursor-pointer'

  if (link) {
    return (
      <div className={classNames('ml-2', className)}>
        <Link to={link} className={linkClassNames}>
          <Icon icon={icon} size={size} />
        </Link>
      </div>
    )
  }

  return (
    <div className={classNames('ml-2', className)}>
      <div className={linkClassNames} onClick={onClick}>
        <Icon icon={icon} size={size} />
      </div>
    </div>
  )
}

export default IconLink
