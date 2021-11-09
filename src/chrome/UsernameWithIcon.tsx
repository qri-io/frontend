import React, { useEffect } from 'react'
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { loadUser } from '../features/users/state/usersActions'
import { selectUserProfile } from '../features/users/state/usersState'
import { DEFAULT_PROFILE_PHOTO_URL } from '..'

interface UsernameWithIconProps {
  username: string
  text?: string // optional text to override the username
  className?: string
  iconWidth?: number
  iconOnly?: boolean
  tooltip?: boolean
}

const UsernameWithIcon: React.FunctionComponent<UsernameWithIconProps> = ({
  username,
  text = username,
  className,
  iconWidth = 18,
  iconOnly = false,
  tooltip = false
}) => {
  const dispatch = useDispatch()
  const profile = useSelector(selectUserProfile(username))

  useEffect(() => {
    loadUser(username)
  }, [dispatch, username])

  return (<div className={classNames('flex items-center tracking-wider', className)}>
    <div className='rounded-2xl inline-block bg-cover flex-shrink-0' title={tooltip ? username : ''} style={{
      height: iconWidth,
      width: iconWidth,
      backgroundImage: `url(${(profile && profile.photo) || DEFAULT_PROFILE_PHOTO_URL})`
    }}/>
    {!iconOnly && <p className='ml-1.5 truncate'>{text}</p>}
  </div>)
}

export default UsernameWithIcon
