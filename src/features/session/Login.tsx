import React from 'react'

import LogInModal from './modal/LogInModal'
import Head from '../app/Head'

const Login: React.FC<{}> = () => (
  <div className='flex flex-col h-full bg-gray-100'>
    <Head data={{
      title: `Login | Qri`
    }}/>
    <div className='m-auto p-10'>
      <div className="shadow-md">
        <LogInModal />
      </div>
    </div>
  </div>
)

export default Login
