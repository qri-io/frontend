import React, { useState } from 'react'
import { Redirect } from 'react-router'
import { useDispatch, useSelector } from 'react-redux';
import { SyncLoader } from 'react-spinners'

import ExternalLink from '../../../chrome/ExternalLink'
import Button from '../../../chrome/Button'
import TextInput from '../../../chrome/forms/TextInput'
import { showModal, clearModal } from '../../app/state/appActions'
import { ModalType } from '../../app/state/appState'
import { signUp } from '../state/sessionActions'
import { selectIsSessionLoading } from '../state/sessionState'
import { validateEmail, validateUsername, validatePassword } from '../state/formValidation'

const SignUpModal: React.FC = () => {

  const [ email, setEmail ] = useState('')
  const [ emailError, setEmailError ] = useState(null)

  const [ username, setUsername ] = useState('')
  const [ usernameError, setUsernameError ] = useState(null)

  const [ password, setPassword ] = useState('')
  const [ passwordError, setPasswordError] = useState(null)

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
      dispatch(signUp(email, username, password)).then((action) => {
        dispatch(clearModal())
      })
    }
  }

  return (
    <div className='bg-white py-7 px-5 text-center' style={{ width: '400px'}}>
      <img className="w-9 mx-auto mb-4" src="https://qri.cloud/assets/apple-touch-icon.png" alt="logo" />
      <div className='text-2xl font-semibold mb-6'>Sign Up for Qrimatic</div>
      <div className='w-64 mx-auto'>
        <div className='mb-6'>
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
        <Button size='lg' className='w-full mb-6' onClick={handleButtonClick}>
          {loading ? <SyncLoader color='#fff' size='6' /> : 'Continue'}
        </Button>

        <div className='mb-3 text-gray-500' style={{ fontSize: '.7rem' }}>
          By continuing, you agree to Qri's <ExternalLink to='https://qri.io/legal/tos'>Terms of Service</ExternalLink> & <ExternalLink to='https://qri.io/legal/privacy-policy'>Privacy Policy</ExternalLink>.
        </div>

        <hr className='w-20 mx-auto mb-3'/>

        <div className='text-xs font-semibold hover:cursor-pointer' onClick={handleLogInClick}>
          Already on Qri?  Log In
        </div>
      </div>
    </div>
  )
}

export default SignUpModal
