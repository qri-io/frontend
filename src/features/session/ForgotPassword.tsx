import React, { useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { trackGoal } from "../analytics/analytics";
import { Link } from "react-router-dom";

import NavBar from "../navbar/NavBar";
import ContentBox from "../../chrome/ContentBox";
import TextInput from "../../chrome/forms/TextInput";
import Button from "../../chrome/Button";
import { showModal } from "../app/state/appActions";
import { ModalType } from "../app/state/appState";
import { fetchPasswordForgot } from "./state/sessionActions";
import { selectIsSessionLoading, selectResetError, selectResetSent } from "./state/sessionState";
import Spinner from "../../chrome/Spinner";
import PasswordForgotBgImage from "./PasswordForgotBgImage";

const ForgotPassword: React.FC = () => {

  const [identifier, setIdentifier] = useState('');

  const dispatch = useDispatch()
  const loading = useSelector(selectIsSessionLoading)
  const sent = useSelector(selectResetSent)
  const error = useSelector(selectResetError)


  const handleSignUpClick = () => {
    // general-click-sign-up event
    trackGoal('VW3UXBQA', 0)
    dispatch(showModal(ModalType.signUp))
  }

  const handleSubmitClick = () => {
    dispatch(fetchPasswordForgot(identifier))
  }

  const returnHashedString = (value: string): string => {
    let hashedString: string = ''
    for (let i=0; i<value.length; i++) {
      if (i === 0 || i === value.length -1) {
        hashedString += value[i]
      } else {
        hashedString += '*'
      }
    }
    return hashedString
  }

  const hashIdentifier = ():string => {
    if (identifier.includes('@')) {
      const splitEmail = identifier.split('@')
      return returnHashedString(splitEmail[0])+'@'+returnHashedString(splitEmail[1])
    }
    return identifier
  }

  return (
    <div className='flex flex-col min-h-full bg-qrigray-100'>
      <NavBar />
      <PasswordForgotBgImage />
      <ContentBox className='absolute top-60 left-12 md:left-64 z-30 ' paddingClassName='p-11'>
        <h1 style={{lineHeight: '36px', width: 276}} className='font-extrabold text-3xl w-60 leading-10 mb-4 whitespace-pre-line'>
          {sent ? 'Password \n Reset Sent' :
          'Forgot your Password?'}</h1>
        {sent ?
          <div>
            <p style={{width: 276}} className='mb-8'>If an account exists for <b>{hashIdentifier()}</b>,
            you will get an email with a link to reset your password.
            If it doesn't arrive, be sure to check your spam folder.</p>
            <Link to='/login'><Button type='secondary' block>Back to Log In</Button></Link>
          </div> :
          <form>
            <div className='mb-8' style={{width: 276}}>
              <TextInput
                name='username'
                error={error}
                value={identifier}
                onChange={(value) => setIdentifier(value)}
                placeholder='Username or Email'
              />
            </div>
            <Button type='secondary' className='mb-6' onClick={handleSubmitClick}  block>
              {loading ? <Spinner color='#fff' size={6} /> : 'Send Password Reset'}
            </Button>
            <div onClick={handleSignUpClick} className='cursor-pointer text-center text-black text-xs font-bold'>
              Not on Qri yet?  Sign Up
            </div>
          </form>}
      </ContentBox>
    </div>

  )
}

export default ForgotPassword;
