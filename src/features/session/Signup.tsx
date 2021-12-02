import React from 'react'

import SignUpModal from './modal/SignUpModal'
import Head from '../app/Head'
import ScrollLayout from '../layouts/ScrollLayout'

const Signup: React.FC<{}> = () => (
  <ScrollLayout>
    <Head data={{
      title: `Login | Qri`
    }}/>
    <div className='my-auto p-6'>
      <SignUpModal />
    </div>
  </ScrollLayout>
)

export default Signup
