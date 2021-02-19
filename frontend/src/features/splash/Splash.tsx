import React from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router'
import { useDispatch } from 'react-redux';

import AnonymousPageLayout from '../app/AnonymousPageLayout';
import Icon from '../../chrome/Icon';
import Button from '../../chrome/Button';
import { showModal } from '../app/state/appActions'
import { ModalType } from '../app/state/appState'
import { User } from '../session/state/sessionState'

interface SplashProps {
  user: User
}

const Splash: React.FC<SplashProps> = ({ user }) => {

  console.log('splash', user)

  const dispatch = useDispatch()

  const handleSignUpClick = () => {
    dispatch(showModal(ModalType.signUp))
  }

  return (
    <AnonymousPageLayout>
      <div className='max-w-screen-xl mx-auto px-10 py-20'>
        <div className="text-center pb-12 md:pb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4">
            Datasets that update themselves
          </h1>
          <div className="max-w-3xl mx-auto">
            <p className="text-xl text-gray-600 mb-8">
              Qrimatic binds code to data, so you can keep your data fresh.  Just write a script to move and munge your data, set a schedule, and we'll take care of the rest.
            </p>
            <div className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center">
              <Link to="/ds/new" >
                <Button type='dark' size='lg' className='mr-3' onClick={handleSignUpClick}>
                  Sign Up
                </Button>
              </Link>

              <Link to="/ds/new" >
                <Button size='lg'>
                  Try it out now <Icon className='ml-3' icon='arrowRight' />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {user && <Redirect to='/dashboard' />}
    </AnonymousPageLayout>
  )
}

export default Splash;
