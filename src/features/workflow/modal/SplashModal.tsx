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
        <div className='flex-grow text-3xl font-black'>Welcome to the workflow editor!</div>
        <IconButton icon='close' className='ml-10' onClick={handleClose}/>
      </div>

      <Carousel
        renderArrowPrev={(clickHandler: () => void, hasPrev: boolean) => (
          <div className='absolute top-0 bottom-0 flex items-center z-10 left-0'>
            <IconButton icon='caretLeft' className='' disabled={!hasPrev} onClick={clickHandler}/>
          </div>
        )}
        renderArrowNext={(clickHandler: () => void, hasNext: boolean) => (
          <div className='absolute top-0 bottom-0 flex items-center z-10 right-0 '>
            <IconButton icon='caretRight' className='' disabled={!hasNext} onClick={clickHandler}/>
          </div>
        )}
        showStatus={false}
        showThumbs={false}
        showIndicators
      >
         <div className='my-12 px-8 flex'>
           <div className='text-2xl font-bold mr-3 leading-tight'>
             1.
           </div>
           <div className='text-md text-left leading-tight'>
             Qri binds code to data, teaching datasets to update themselves
           </div>
         </div>
         <div className='my-12 px-8 flex'>
           <div className='text-2xl font-bold mr-3 leading-tight'>
             2.
           </div>
           <div className='text-md text-left leading-tight'>
             Triggers kick off workflows, completions run when datasets update
           </div>
         </div>
         <div className='my-12 px-8 flex'>
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
