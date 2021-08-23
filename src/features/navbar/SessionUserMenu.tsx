import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import DropdownMenu from '../../chrome/DropdownMenu'
import { AnonUser, selectSessionUser } from '../session/state/sessionState'
import { logOut } from '../session/state/sessionActions'
import { showModal } from '../app/state/appActions'
import { ModalType } from '../app/state/appState'
import Button from '../../chrome/Button'
import Link from '../../chrome/Link'

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
        <Link onClick={handleLogInClick}>Log In</Link>
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
      <Link to='https://qri.io/docs'>Help</Link>
      <DropdownMenu icon={icon} className='ml-8' items={[
        {
          label: 'Profile',
          to: `/${user.username}`
        },
        {
          label: 'Send Feedback',
          to:'https://qri.io/contact'
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
