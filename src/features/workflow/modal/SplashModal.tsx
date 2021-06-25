import React from 'react'
import { useDispatch } from 'react-redux'
import { Carousel } from 'react-responsive-carousel'

import Button from '../../../chrome/Button'
import { clearModal } from '../../app/state/appActions'
import IconButton from '../../../chrome/IconButton'

// import styles for react-responsive-carousel, used in workflow splash modal
import 'react-responsive-carousel/lib/styles/carousel.min.css'

const SignUpModal: React.FC = () => {
  const dispatch = useDispatch()

  const handleClose = () => {
    dispatch(clearModal())
  }

  return (
    <div className='bg-white p-8 text-left text-qrinavy' style={{ width: '440px'}}>
      <div className='flex'>
        <div className='flex-grow text-3xl font-black mb-8'>Welcome to the workflow editor!</div>
        <IconButton icon='close' className='ml-10' onClick={handleClose}/>
      </div>

      <Carousel
        showStatus={false}
        showArrows={false}
        showThumbs={false}
        showIndicators
      >
         <div className='mb-12 flex'>
           <div className='text-2xl font-bold mr-3 leading-tight'>
             1.
           </div>
           <div className='text-md text-left leading-tight'>
             Qri binds code to data, teaching datasets to update themselves
           </div>
         </div>
         <div className='mb-12 flex'>
           <div className='text-2xl font-bold mr-3 leading-tight'>
             2.
           </div>
           <div className='text-md text-left leading-tight'>
             Triggers kick off workflows, completions run when datasets update
           </div>
         </div>
         <div className='mb-12 flex'>
           <div className='text-2xl font-bold mr-3 leading-tight'>
             3.
           </div>
           <div className='text-md text-left leading-tight'>
             Edit code, dry run to test, then hit deploy!
           </div>
         </div>
      </Carousel>

      <Button size='sm' className='w-full mt-2' onClick={handleClose} submit>
        Go to Workflow!
      </Button>
    </div>
  )
}

export default SignUpModal
