import React from 'react'

import Icon from '../../chrome/Icon'
import TextLink from '../../chrome/TextLink'
import IconLink from '../../chrome/IconLink'

const Footer: React.FC<{}> = () => (
  <div className='flex w-9/12 mx-auto text-qrinavy text-sm py-5 tracking-wide'>
    <div className='flex flex-grow font-medium'>
      <TextLink
        className='mr-10'
        colorClassName='text-qrinavy hover:text-qripink'
        to='https://qri.io/docs'
      >
        Tutorials
      </TextLink>
      <TextLink
        className='mr-10'
        colorClassName='text-qrinavy hover:text-qripink'
        to='https://qri.io/docs'
      >
        Docs
      </TextLink>
      <TextLink
        className='mr-10'
        colorClassName='text-qrinavy hover:text-qripink'
        to='https://qri.io/faq'
      >
        FAQs
      </TextLink>
    </div>
    <div className='flex flex-grow justify-end'>
      {
        [
          { icon: 'github' },
          { icon: 'youtube' },
          { icon: 'twitter' },
          { icon: 'discord' }
        ].map(({ icon }, i) => <IconLink key={i} icon={icon} size='md' className='ml-5' />)
      }
    </div>
  </div>
)


export default Footer
