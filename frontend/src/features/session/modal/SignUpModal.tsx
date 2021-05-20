import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from '@reduxjs/toolkit';

import { ACTION_FAILURE, getActionType } from '../../../store/api';
import ExternalLink from '../../../chrome/ExternalLink'
import Button from '../../../chrome/Button'
import TextInput from '../../../chrome/forms/TextInput'
import { showModal, clearModal } from '../../app/state/appActions'
import { ModalType } from '../../app/state/appState'
import { signUp } from '../state/sessionActions'
import { selectIsSessionLoading } from '../state/sessionState'
import { validateEmail, validateUsername, validatePassword, ValidationError } from '../state/formValidation'
import QriLogo from '../../../chrome/QriLogo';
import Spinner from '../../../chrome/Spinner';

const SignUpModal: React.FC = () => {

  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState<ValidationError>(null)

  const [username, setUsername] = useState('')
  const [usernameError, setUsernameError] = useState<ValidationError>(null)

  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState<ValidationError>(null)

  const [signupError, setSignupError] = useState('')

  const dispatch = useDispatch()
  const loading = useSelector(selectIsSessionLoading)


  const handleLogInClick = () => {
    dispatch(showModal(ModalType.logIn))
  }

  const handleButtonClick = () => {
    // validate email
    const emailError = validateEmail(email)
    setEmailError(emailError)

    // validate username
    const usernameError = validateUsername(username)
    setUsernameError(usernameError)

    const passwordError = validatePassword(password)
    setPasswordError(passwordError)

    if (!emailError && !usernameError && !passwordError) {
      signUp(email, username, password)(dispatch)
        .then((action: AnyAction) => {
          if (getActionType(action) === ACTION_FAILURE) {
            setSignupError(action.payload.err.message)
            return
          }
          dispatch(clearModal())
        })
    }
  }

  return (
    <div className='bg-white py-9 px-5 text-center' style={{ width: '440px'}}>
      <div className='w-10 m-auto mb-4'>
        <QriLogo size='sm'/>
      </div>
      <div className='text-3xl font-black mb-8 text-qrinavy'>Sign Up for Qri</div>
      <div className='w-72 mx-auto'>
        <div className='mb-8'>
          <TextInput
            name='email'
            placeholder='Email'
            value={email}
            onChange={(e) => { setEmail(e.target.value)  }}
            error={emailError}
          />
          <TextInput
            name='username'
            placeholder='Username'
            value={username}
            onChange={(e) => { setUsername(e.target.value)  }}
            error={usernameError}
          />
          <TextInput
            name='password'
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => { setPassword(e.target.value)  }}
            error={passwordError}
          />
        </div>
        {signupError && <div className='text-xs text-red-500 text-left mb-2'>{signupError}</div>}
        <Button size='sm' className='w-full mb-6' onClick={handleButtonClick}>
          {loading ? <Spinner color='#fff' size='6' /> : 'Continue'}
        </Button>

        <div className='mb-3 text-qrigray-400 tracking-wider text-xs'>
          By continuing, you agree to Qri's <ExternalLink to='https://qri.io/legal/tos'>Terms of Service</ExternalLink> & <ExternalLink to='https://qri.io/legal/privacy-policy'>Privacy Policy</ExternalLink>.
        </div>

        <hr className='w-20 mx-auto mb-3'/>

        <div className='text-qrinavy text-xs font-medium hover:cursor-pointer' onClick={handleLogInClick}>
          Already on Qri?  Log In
        </div>
      </div>
    </div>
  )
}

export default SignUpModal
