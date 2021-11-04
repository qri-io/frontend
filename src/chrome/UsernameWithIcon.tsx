import React from 'react'
import classNames from 'classnames'

interface UsernameWithIconProps {
  username: string
  className?: string
  iconWidth?: number
  iconOnly?: boolean
  tooltip?: boolean
}

// TODO(chriswhong): make the prop a user object, or pass in icon URL as a separate prop
const UsernameWithIcon: React.FunctionComponent<UsernameWithIconProps> = ({
  username,
  className,
  iconWidth = 18,
  iconOnly = false,
  tooltip = false
}) => (
   <div className={classNames('flex items-center tracking-wider', className)}>
     <div className='rounded-2xl inline-block bg-cover flex-shrink-0' title={tooltip ? username : ''} style={{
       height: iconWidth,
       width: iconWidth,
       backgroundImage: 'url(https://qri-user-images.storage.googleapis.com/1570029763701.png)'
     }}/>
     {!iconOnly && <p className='ml-1.5 truncate'>{username}</p>}
   </div>
)

export default UsernameWithIcon
