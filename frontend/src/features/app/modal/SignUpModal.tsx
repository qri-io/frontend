import React from 'react'
import { useDispatch } from 'react-redux';

import ExternalLink from '../../../chrome/ExternalLink'
import Button from '../../../chrome/Button'
import TextInput from '../../../chrome/forms/TextInput'
import { showModal } from '../state/appActions'
import { ModalType } from '../state/appState'


const LogInModal: React.FC = () => {
  const dispatch = useDispatch()

  const handleLogInClick = () => {
    dispatch(showModal(ModalType.logIn))
  }
  return (
    <div className='bg-white py-7 px-5 text-center' style={{ width: '400px'}}>
      <img className="w-9 mx-auto mb-4" src="https://qri.cloud/assets/apple-touch-icon.png" alt="logo" />
      <div className='text-2xl font-semibold mb-6'>Sign Up for Qrimatic</div>
      <div className='w-64 mx-auto'>
        <div className='mb-6'>
          <TextInput
            placeholder='Email'
          />
          <TextInput
            placeholder='Password'
          />
        </div>
        <Button size='lg' className='w-full mb-6'>Continue</Button>

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

export default LogInModal
