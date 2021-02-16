import React from 'react';
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux';

import Button from '../../chrome/Button';
import { showModal } from '../app/state/appActions'
import { ModalType } from '../app/state/appState'

export interface AnonymousNavBarProps {}

const AnonymousNavBar: React.FC<AnonymousNavBarProps> = ({ children }) => {
  const dispatch = useDispatch()

  const handleLogInClick = () => {
    dispatch(showModal(ModalType.logIn))
  }

  const handleSignUpClick = () => {
    dispatch(showModal(ModalType.signUp))
  }

  return (
    <div className='bg-qrinavy text-white text-bold flex p-4 items-center'>
      <Link className='px-1 font-bold text-lg tracking-tight' to='/'>Qrimatic</Link>
      <div className="py-2 opacity-0">.</div> {/* forces height */}
      {children}
      <div className='flex ml-auto items-center'>
      <>
        {/* TODO (chriswhong): turn this into a component for link-style text */}
        <div
          className='mr-4 hover:text-qriblue-200 hover:cursor-pointer transition-all duration-100'
          onClick={handleLogInClick}
        >Log In</div>
        <Button onClick={handleSignUpClick}>
          Sign Up
        </Button>
      </>
      </div>
    </div>
  )
}

export default AnonymousNavBar
