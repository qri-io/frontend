import React from 'react'

import LogInModal from './modal/LogInModal'
import Head from '../app/Head'
import ScrollLayout from '../layouts/ScrollLayout'

const Login: React.FC<{}> = () => (
  <ScrollLayout>
    <Head data={{
      title: `Login | Qri`
    }}/>
    <div className='my-auto p-6'>
      <LogInModal />
    </div>
  </ScrollLayout>
)

export default Login
