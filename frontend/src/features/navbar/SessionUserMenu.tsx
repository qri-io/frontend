import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import DropdownMenu from '../../chrome/DropdownMenu'
import { AnonUser, selectSessionUser } from '../session/state/sessionState'
import { logOut } from '../session/state/sessionActions'
import { showModal } from '../app/state/appActions'
import { ModalType } from '../app/state/appState'
import Button from '../../chrome/Button'
import ExternalLink from '../../chrome/ExternalLink'

const navbarLinkClassNames = 'text-qriblue font-medium hover:text-qriblue-800 hover:cursor-pointer transition-all duration-100'

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
        <div className={navbarLinkClassNames}
          onClick={handleLogInClick}
        >Log In</div>
        <Button onClick={handleSignUpClick} size='sm' className='ml-8'>
          Sign Up
        </Button>
      </>
    )
  }

  const menuItems = [
    {
      text: 'Profile',
      link: `/${user.username}`
    },
    {
      text: 'Send Feedback',
      link: 'https://qri.io/contact'
    },
    {
      onClick: () => { dispatch(logOut()) },
      text: 'Log Out',
    }
  ]

  return (
    <div className="relative flex items-center">
      <ExternalLink
        to='https://qri.io/docs'
        className={navbarLinkClassNames}
      >Help</ExternalLink>
      <DropdownMenu items={menuItems} className='ml-8'>
        <div className='rounded-2xl inline-block bg-cover flex-shrink-0' style={{
          height: '30px',
          width: '30px',
          backgroundImage: `url(${user.profile})`
        }}></div>
      </DropdownMenu>
    </div>
  )
}

export default SessionUserMenu
