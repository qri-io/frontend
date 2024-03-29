import React from 'react'
import classNames from 'classnames'
import Link from './Link'
import Icon, { IconSize } from './Icon'

interface IconLinkProps {
  icon: string
  to?: string
  size?: IconSize
  className?: string
  colorClassName?: string
  onClick?: () => void
  title?: string
}

const IconLink: React.FC<IconLinkProps> = ({
  icon,
  to,
  size = 'sm',
  className,
  colorClassName = 'text-black hover:text-qripink-600',
  onClick,
  title
}) => {
  const linkClassNames = `${colorClassName} hover:cursor-pointer`

  if (to) {
    return (
      <div title={title} className={classNames('ml-2', className)} onClick={onClick}>
        <Link to={to} className={linkClassNames} colorClassName={colorClassName}>
          <Icon icon={icon} size={size} />
        </Link>
      </div>
    )
  }

  return (
    <div title={title} className={classNames('ml-2', className)}>
      <div className={linkClassNames} onClick={onClick}>
        <Icon icon={icon} size={size} />
      </div>
    </div>
  )
}

export default IconLink
