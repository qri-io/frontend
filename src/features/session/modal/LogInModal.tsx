import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AnyAction } from '@reduxjs/toolkit'

import { ACTION_FAILURE, AppDispatch, getActionType } from '../../../store/api'
import Link from '../../../chrome/Link'
import Button from '../../../chrome/Button'
import TextInput from '../../../chrome/forms/TextInput'
import { showModal, clearModal } from '../../app/state/appActions'
import { logIn, resetForgotState } from '../state/sessionActions'
import { selectIsSessionLoading } from '../state/sessionState'
import { ModalType } from '../../app/state/appState'
import QriLogo from '../../../chrome/QriLogo'
import Spinner from '../../../chrome/Spinner'

const LogInModal: React.FC = () => {
  const [ username, setUsername ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ loginError, setLoginError ] = useState('')

  const dispatch: AppDispatch = useDispatch()
  const loading = useSelector(selectIsSessionLoading)

  const handleSignUpClick = () => {
    dispatch(showModal(ModalType.signUp))
  }

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault()
    dispatch(logIn(username, password))
      .then((action: AnyAction) => {
        if (getActionType(action) === ACTION_FAILURE) {
          setLoginError(action.error)
          return
        }
        dispatch(clearModal())
      })
  }

  const handleForgotPasswordRedirect = () => {
    dispatch(clearModal())
    dispatch(resetForgotState())
  }

  return (
    <div className='bg-white py-9 px-5 sm:px-24 text-center w-full rounded-2xl mx-auto' style={{ maxWidth: 440 }}>
      <div className='w-10 m-auto mb-4'>
        <QriLogo size='sm'/>
      </div>
      <div className='text-3xl font-black mb-8 text-qrinavy-800'>Welcome to Qri</div>
      <div className='w-72 mx-auto'>
        <form>
          <div className='mb-8'>
            <TextInput
              name='username'
              value={username}
              onChange={(value) => { setUsername(value) }}
              placeholder='Username'
            />
            <TextInput
              name='password'
              type='password'
              value={password}
              onChange={(value) => { setPassword(value) }}
              placeholder='Password'
            />
            <Link to='/forgot-password' onClick={handleForgotPasswordRedirect}><div className='text-left text-black text-sm font-semibold'>Forgot your Password?</div></Link>
          </div>

          {loginError && <div className='text-xs text-red-500 text-left mb-2'>{loginError}</div>}

          <Button id='login_modal_login_button' className='mb-6' onClick={handleButtonClick} submit block>
            {loading ? <Spinner color='#fff' size={6} /> : 'Log In'}
          </Button>
        </form>
        <div className='mb-3 text-qrigray-400 text-xs'>
          By continuing, you agree to Qri&apos;s <Link to='https://qri.io/legal/tos'>Terms of Service</Link> & <Link to='https://qri.io/legal/privacy-policy'>Privacy Policy</Link>.
        </div>

        <hr className='w-20 mx-auto mb-3'/>

        <div className='text-black text-xs font-medium'>
          Not on Qri yet? <Link onClick={handleSignUpClick}>Sign Up</Link>
        </div>
      </div>
    </div>
  )
}

export default LogInModal
