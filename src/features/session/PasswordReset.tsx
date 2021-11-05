import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation } from "react-router-dom"

import NavBar from "../navbar/NavBar"
import PasswordForgotBgImage from "./PasswordResetBgImage"
import ContentBox from "../../chrome/ContentBox"
import TextInput from "../../chrome/forms/TextInput"
import Button from "../../chrome/Button"
import Spinner from "../../chrome/Spinner"
import { selectIsSessionLoading, selectResetError } from "./state/sessionState"
import { resetPassword } from "./state/sessionActions"
import { validatePassword } from "./state/formValidation"

const PasswordReset: React.FC = () => {
  const [password, setPassword] = useState('')
  const [rePassword, setRePassword] = useState('')
  const [inputError, setInputError] = useState('')

  const location = useLocation()
  const error = useSelector(selectResetError)
  const dispatch = useDispatch()
  const loading = useSelector(selectIsSessionLoading)

  const handleSubmitClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setInputError('')
    const error = validatePassword(password)
    if (password !== rePassword) {
      setInputError("Passwords don't match")
      return
    }
    if (error) {
      setInputError(error)
      return
    }
    const id: string = new URLSearchParams(location.search).get("token") || ''
    resetPassword(id, password)(dispatch)
  }

  return (
    <div className='flex flex-col min-h-full bg-qrigray-100'>
      <NavBar />
      <PasswordForgotBgImage />
      <ContentBox className='absolute top-60 right-12 md:right-64 z-30 ' paddingClassName='p-11'>
        <h1 style={{ lineHeight: '36px', width: 276 }} className='font-extrabold text-3xl w-60 leading-10 mb-8 whitespace-pre-line'>Reset <br/> your
          Password</h1>
        <form>
          <div className='mb-8' style={{ width: 276 }}>
            <TextInput
              type='password'
              name='password'
              value={password}
              onChange={(value) => setPassword(value)}
              placeholder='New Password'
              className='mb-6'
            />
            <TextInput
              type='password'
              name='repeat-password'
              error={error || inputError}
              value={rePassword}
              onChange={(value) => setRePassword(value)}
              placeholder='Repeat Password'
            />
          </div>

          <Button type='secondary' className='mb-6' onClick={handleSubmitClick} submit block>
            {loading ? <Spinner color='#fff' size={6} /> : 'Reset Password'}
          </Button>
        </form>
      </ContentBox>
    </div>
  )
}

export default PasswordReset
