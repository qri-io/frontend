import React from 'react'
import classNames from 'classnames'

import assignUserIcon from '../utils/assignUserIcon'

interface UsernameWithIconProps {
  username: string
  // if name exists, this component will render :username/:name
  name?: string
  className?: string
  iconWidth?: number
  iconOnly?: boolean
  tooltip?: boolean
}

const UsernameWithIcon: React.FunctionComponent<UsernameWithIconProps> = ({
  username,
  name,
  className,
  iconWidth = 18,
  iconOnly = false,
  tooltip = false
}) => {
  const userIcon = assignUserIcon(username)

  return (
    <div className={classNames('flex items-center tracking-wider', className)}>
      <div className='rounded-2xl inline-block bg-cover flex-shrink-0' title={tooltip ? username : ''} style={{
        height: iconWidth,
        width: iconWidth,
        backgroundImage: `url(${userIcon})`
      }}/>
      {!iconOnly && <p className='ml-1.5 truncate'>{name ? `${username}/${name}` : username}</p>}
    </div>
  )
}

export default UsernameWithIcon
