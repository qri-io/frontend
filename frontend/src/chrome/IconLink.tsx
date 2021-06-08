import React from 'react'
import ExternalLink from './ExternalLink'
import Icon, { IconSize } from './Icon'

interface IconLinkProps {
  icon: string
  link?: string
  onClick?: () => void
  size?: IconSize
}

const IconLink: React.FC<IconLinkProps> = ({
  icon,
  link,
  onClick,
  size='sm'
}) => {
  const iconComponent = <Icon icon={icon} size={size} />
  const classNames = 'text-qrinavy hover:text-qripink hover:cursor-pointer'

  if (link) {
    return (
      <div className='ml-2'>
        <ExternalLink to={link} className={classNames}>
          {iconComponent}
        </ExternalLink>
      </div>
    )
  }

  if (onClick) {
    return (
      <div className='ml-2'>
        <div className={classNames} onClick={onClick}>
          {iconComponent}
        </div>
      </div>
    )
  }
}

export default IconLink
