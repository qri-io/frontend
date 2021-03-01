import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Icon from '../../chrome/Icon'
import DropdownMenu from '../../chrome/DropdownMenu'
import { NewUser, selectSessionUser } from '../session/state/sessionState'
import { logOut } from '../session/state/sessionActions'
import { showModal } from '../app/state/appActions'
import { ModalType } from '../app/state/appState'
import Button from '../../chrome/Button'

const SessionUserMenu: React.FC<{}> = () => {
  const user = useSelector(selectSessionUser)
  const dispatch = useDispatch()

  if (user === NewUser) {
    const handleLogInClick = () => {
      dispatch(showModal(ModalType.logIn))
    }
  
    const handleSignUpClick = () => {
      dispatch(showModal(ModalType.signUp))
    }

    return (
      <>
        <div
          className='mr-4 hover:text-qriblue-200 hover:cursor-pointer transition-all duration-100'
          onClick={handleLogInClick}
        >Log In</div>
        <Button onClick={handleSignUpClick}>
          Sign Up
        </Button>
      </>
    )
  }

  const menuItems = [
    {
      text: 'Documentation',
      link: 'https://qri.io/docs'
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
    <div className="relative">
      <DropdownMenu items={menuItems}>
        <p className=' font-bold text-white relative flex items-baseline group hover:text'>
          {user.username} <Icon icon='sortDown' className='ml-3'/>
        </p>
      </DropdownMenu>
    </div>
  )
}

export default SessionUserMenu
