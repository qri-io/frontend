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
  size='sm',
  onClick
}) => {
  const classNames = 'text-qrinavy hover:text-qripink hover:cursor-pointer'

  if (link) {
    return (
      <div className='ml-2'>
        <ExternalLink to={link} className={classNames}>
          <Icon icon={icon} size={size} />
        </ExternalLink>
      </div>
    )
  }

  return (
    <div className='ml-2'>
      <div className={classNames} onClick={onClick}>
        <Icon icon={icon} size={size} />
      </div>
    </div>
  )
}

export default IconLink
