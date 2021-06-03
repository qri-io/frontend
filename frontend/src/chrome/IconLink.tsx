import React from 'react'
import ExternalLink from './ExternalLink'
import Icon from './Icon'

interface IconLinkProps {
  icon: string
  link: string
}

const IconLink: React.FC<IconLinkProps> = ({
  icon,
  link
}) => (
  <div className='ml-2'>
    <ExternalLink to={link} className='text-qrinavy hover:text-qrinavy-600'>
      <Icon icon={icon} size='sm'/>
    </ExternalLink>
  </div>
)

export default IconLink
