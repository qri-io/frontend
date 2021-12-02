import React from 'react'

import Link from '../../chrome/Link'
import QriSocialLinks from './QriSocialLinks'

const Footer: React.FC<{}> = () => (
  <div className='flex w-9/12 mx-auto text-black text-sm py-5 tracking-wide'>
    <div className='flex flex-grow font-medium'>
      <Link
        className='mr-10'
        colorClassName='text-black hover:text-qripink-600'
        to='https://qri.io/docs'
      >
        Tutorials
      </Link>
      <Link
        className='mr-10'
        colorClassName='text-black hover:text-qripink-600'
        to='https://qri.io/docs'
      >
        Docs
      </Link>
      <Link
        className='mr-10'
        colorClassName='text-black hover:text-qripink-600'
        to='https://qri.io/faq'
      >
        FAQs
      </Link>
    </div>
    <QriSocialLinks />
  </div>
)

export default Footer
