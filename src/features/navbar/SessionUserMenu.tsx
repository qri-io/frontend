import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'

import DropdownMenu, { Divider } from '../../chrome/DropdownMenu'
import { AnonUser, selectSessionUser } from '../session/state/sessionState'
import { logOut } from '../session/state/sessionActions'
import { showModal } from '../app/state/appActions'
import { ModalType } from '../app/state/appState'
import Button from '../../chrome/Button'
import Link from '../../chrome/Link'
import { resetCollectionState } from "../collection/state/collectionActions"
import { trackGoal } from '../../features/analytics/analytics'
import assignUserIcon from '../../utils/assignUserIcon'

const SessionUserMenu: React.FC<{}> = () => {
  const user = useSelector(selectSessionUser)
  const dispatch = useDispatch()
  const history = useHistory()

  if (user === AnonUser) {
    const handleLogInClick = () => {
      dispatch(showModal(ModalType.logIn))
    }

    const handleSignUpClick = () => {
      // general-click-sign-up event
      trackGoal('VW3UXBQA', 0)
      dispatch(showModal(ModalType.signUp))
    }

    return (
      <>
        <Link id='user_menu_login_button' onClick={handleLogInClick}>Log In</Link>
        <Button id='user_menu_sign_up_button' onClick={handleSignUpClick} size='lg' className='ml-8'>
          Sign Up
        </Button>
      </>
    )
  }

  const userIcon = (
    <div
      className='rounded-3xl inline-block bg-cover flex-shrink-0'
      style={{
        height: '30px',
        width: '30px',
        backgroundImage: `url(${assignUserIcon(user.username)})`
      }}
    />
  )

  return (
    <div className="relative flex items-center font-medium">
      <Link
        to='https://qri.io/docs'
        className='text-sm font-semibold hidden md:block'
        colorClassName='text-black hover:text-qripink-600'
        onClick={() => {
          // general-click-help event
          trackGoal('MN77WFUZ', 0)
        }}
      >Help</Link>
      <DropdownMenu icon={userIcon} className='ml-4 md:ml-8 session_user_menu' items={[
        {
          element: (
            <div className='flex'>
              <div className='mr-2'>
                {userIcon}
              </div>
              <div>
                <div className='font-semibold text-sm'>{user.username}</div>
                <div className='text-qrigray-400 font-light' style={{ fontSize: 10 }}>{user.email}</div>
              </div>

            </div>
          )
        },
        {
          element: <Divider />
        },
        {
          label: 'Profile',
          to: `/${user.username}`
        },
        {
          label: 'Send Feedback',
          to: 'https://qri.io/contact'
        },
        {
          label: 'Log Out',
          onClick: () => {
            dispatch(logOut())
            dispatch(resetCollectionState())
            history.push('/')
          }
        }
      ]} />
    </div>
  )
}

export default SessionUserMenu
