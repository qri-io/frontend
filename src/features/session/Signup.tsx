import React from 'react'

import SignUpModal from './modal/SignUpModal';

const Signup: React.FC<{}> = () => (
  <div className='flex flex-col h-full bg-gray-100'>
    <div className='m-auto p-10'>
      <div className="shadow-md">
        <SignUpModal />
      </div>
    </div>
  </div>
)

export default Signup;
