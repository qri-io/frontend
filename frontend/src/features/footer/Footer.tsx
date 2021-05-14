import React from 'react'

import Icon from '../../chrome/Icon'

const Footer: React.FC = () => {
  return (
    <div className='flex w-9/12 mx-auto text-qrinavy text-sm py-5 tracking-wide'>
      <div className='flex flex-grow'>
        <div className='mr-10'>
          Tutorials
        </div>
        <div className='mr-10'>
          Docs
        </div>
        <div className='mr-10'>
          FAQs
        </div>
      </div>
      <div className='flex flex-grow justify-end'>
        <Icon icon='github' className='ml-5' />
        <Icon icon='youtube' className='ml-5' />
        <Icon icon='twitter' className='ml-5' />
        <Icon icon='discord' className='ml-5' />
      </div>
    </div>
  )
}

export default Footer
