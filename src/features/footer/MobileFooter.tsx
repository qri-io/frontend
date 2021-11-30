import React from 'react'

import Link from '../../chrome/Link'
import QriSocialLinks from './QriSocialLinks'

const Footer: React.FC<{}> = () => (
  <div className='flex flex-col text-black text-sm py-8 tracking-wide items-center'>
    <div className='flex flex-grow justify-center md:justify-end mb-6'>
      <div
        className='mr-5'
      >
        &copy; 2021 qri, inc.
      </div>
      <Link
        className='mr-5'
        colorClassName='text-black hover:text-qripink-600'
        to='https://qri.io/legal/tos'
      >
        Terms of Service
      </Link>
      <Link
        colorClassName='text-black hover:text-qripink-600'
        to='https://qri.io/legal/privacy-policy'
      >
        Privacy Policy
      </Link>
    </div>
    <QriSocialLinks/>
  </div>
)

export default Footer
