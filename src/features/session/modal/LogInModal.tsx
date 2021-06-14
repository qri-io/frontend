import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { AnyAction } from '@reduxjs/toolkit'

import { ACTION_FAILURE, getActionType } from '../../../store/api'
import TextLink from '../../../chrome/TextLink'
import Button from '../../../chrome/Button'
import TextInput from '../../../chrome/forms/TextInput'
import { showModal, clearModal } from '../../app/state/appActions'
import { logIn } from '../state/sessionActions'
import { selectIsSessionLoading } from '../state/sessionState'
import { ModalType } from '../../app/state/appState'
import QriLogo from '../../../chrome/QriLogo'
import Spinner from '../../../chrome/Spinner'


const LogInModal: React.FC = () => {

  const [ username, setUsername ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ loginError, setLoginError ] = useState('')

  const dispatch = useDispatch()
  const loading = useSelector(selectIsSessionLoading)

  const handleSignUpClick = () => {
    dispatch(showModal(ModalType.signUp))
  }

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault()
    logIn(username, password)(dispatch)
      .then((action: AnyAction) => {
        if (getActionType(action) === ACTION_FAILURE) {
          setLoginError(action.error)
          return
        }
        dispatch(clearModal())
      })
  }

  return (
    <div className='bg-white py-9 px-5 text-center' style={{ width: '440px'}}>
      <div className='w-10 m-auto mb-4'>
        <QriLogo size='sm'/>
      </div>
      <div className='text-3xl font-black mb-8 text-qrinavy'>Welcome to Qri</div>
      <div className='w-72 mx-auto'>
        <form>
          <div className='mb-8'>
            <TextInput
              name='username'
              value={username}
              onChange={(value) => { setUsername(value)  }}
              placeholder='Username'
            />
            <TextInput
              name='password'
              type='password'
              value={password}
              onChange={(value) => { setPassword(value)  }}
              placeholder='Password'
            />
            <Link to='/forgot-password'><div className='text-left text-qrinavy text-xs font-medium'>Forgot your Password?</div></Link>
          </div>

          {loginError && <div className='text-xs text-red-500 text-left mb-2'>{loginError}</div>}

          <Button size='sm' className='w-full mb-6' onClick={handleButtonClick} submit>
            {loading ? <Spinner color='#fff' size={6} /> : 'Log In'}
          </Button>
        </form>
        <div className='mb-3 text-qrigray-400 tracking-wider text-xs'>
          By continuing, you agree to Qri's <TextLink to='https://qri.io/legal/tos'>Terms of Service</TextLink> & <TextLink to='https://qri.io/legal/privacy-policy'>Privacy Policy</TextLink>.
        </div>

        <hr className='w-20 mx-auto mb-3'/>

        <div className='text-qrinavy text-xs font-medium'>
          Not on Qri yet? <TextLink onClick={handleSignUpClick}>Sign Up</TextLink>
        </div>
      </div>
    </div>
  )
}

export default LogInModal