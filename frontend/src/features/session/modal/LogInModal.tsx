import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { SyncLoader } from 'react-spinners'

import ExternalLink from '../../../chrome/ExternalLink'
import Button from '../../../chrome/Button'
import TextInput from '../../../chrome/forms/TextInput'
import { showModal, clearModal } from '../../app/state/appActions'
import { logIn } from '../state/sessionActions'
import { selectIsSessionLoading } from '../state/sessionState'
import { ModalType } from '../../app/state/appState'


const LogInModal: React.FC = () => {

  const [ username, setUsername ] = useState('')
  const [ password, setPassword ] = useState('')

  const dispatch = useDispatch()
  const loading = useSelector(selectIsSessionLoading)

  const handleSignUpClick = () => {
    dispatch(showModal(ModalType.signUp))
  }

  const handleButtonClick = () => {
    dispatch(logIn(username, password)).then(() => {
      dispatch(clearModal())
    })
  }

  return (
    <div className='bg-white py-7 px-5 text-center' style={{ width: '400px'}}>
      <img className="w-9 mx-auto mb-4" src="https://qri.cloud/assets/apple-touch-icon.png" alt="logo" />
      <div className='text-2xl font-semibold mb-6'>Welcome to Qrimatic</div>
      <div className='w-64 mx-auto'>
        <div className='mb-6'>
          <TextInput
            name='username'
            value={username}
            onChange={(e) => { setUsername(e.target.value)  }}
            placeholder='Username'
          />
          <TextInput
            name='password'
            type='password'
            value={password}
            onChange={(e) => { setPassword(e.target.value)  }}
            placeholder='Password'
          />
          <Link to='/forgot-password'><div className='text-left text-xs font-semibold'>Forgot your Password?</div></Link>
        </div>
        <Button size='lg' className='w-full mb-6' onClick={handleButtonClick}>
          {loading ? <SyncLoader color='#fff' size='6' /> : 'Log In'}
        </Button>

        <div className='mb-3 text-gray-500' style={{ fontSize: '.7rem' }}>
          By continuing, you agree to Qri's <ExternalLink to='https://qri.io/legal/tos'>Terms of Service</ExternalLink> & <ExternalLink to='https://qri.io/legal/privacy-policy'>Privacy Policy</ExternalLink>.
        </div>

        <hr className='w-20 mx-auto mb-3'/>

        <div className='text-xs font-semibold hover:cursor-pointer' onClick={handleSignUpClick}>
          Not on Qri yet? Sign Up
        </div>
      </div>
    </div>
  )
}

export default LogInModal
