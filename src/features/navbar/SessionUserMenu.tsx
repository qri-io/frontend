import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import DropdownMenu from '../../chrome/DropdownMenu'
import { AnonUser, selectSessionUser } from '../session/state/sessionState'
import { logOut } from '../session/state/sessionActions'
import { showModal } from '../app/state/appActions'
import { ModalType } from '../app/state/appState'
import Button from '../../chrome/Button'
import TextLink from '../../chrome/TextLink'
import ExternalLink from '../../chrome/ExternalLink'

const SessionUserMenu: React.FC<{}> = () => {
  const user = useSelector(selectSessionUser)
  const dispatch = useDispatch()

  if (user === AnonUser) {
    const handleLogInClick = () => {
      dispatch(showModal(ModalType.logIn))
    }

    const handleSignUpClick = () => {
      dispatch(showModal(ModalType.signUp))
    }

    return (
      <>
        <TextLink onClick={handleLogInClick}>Log In</TextLink>
        <Button onClick={handleSignUpClick} size='sm' className='ml-8'>
          Sign Up
        </Button>
      </>
    )
  }

  const icon = <div
    className='rounded-2xl inline-block bg-cover flex-shrink-0' 
    style={{
      height: '30px',
      width: '30px',
      backgroundImage: `url(${user.profile})`
    }}></div>

  return (
    <div className="relative flex items-center font-medium">
      <TextLink to='https://qri.io/docs'>Help</TextLink>
      <DropdownMenu icon={icon} className='ml-8' items={[
        {
          label: <Link to={`/${user.username}`}>Profile</Link>
        },
        {
          label: <ExternalLink to='https://qri.io/contact'>Send Feedback</ExternalLink>
        },
        { 
          label: 'Log Out',
          onClick: () => { dispatch(logOut()) }
        }
      ]} />
    </div>
  )
}

export default SessionUserMenu
