import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Icon from '../../chrome/Icon'
import DropdownMenu from '../../chrome/DropdownMenu'
import { selectSessionUser } from '../session/state/sessionState'
import { logOut } from '../session/state/sessionActions'

console.log('FOO', logOut)


const SessionUserMenu: React.FC<any> = () => {
  const user = useSelector(selectSessionUser)
  const dispatch = useDispatch()

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
