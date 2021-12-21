import React from 'react'
import { useDispatch } from 'react-redux'
import { Carousel } from 'react-responsive-carousel'

import Button from '../../../chrome/Button'
import { clearModal } from '../../app/state/appActions'
import IconButton from '../../../chrome/IconButton'

// import styles for react-responsive-carousel, used in workflow splash modal
import 'react-responsive-carousel/lib/styles/carousel.min.css'

export interface AutomationSplashModalProps {
  title: string
}

const AutomationSplashModal: React.FC<AutomationSplashModalProps> = ({
  title = 'Let\'s make an Automated Dataset!'
}) => {
  const dispatch = useDispatch()

  const handleClose = () => {
    dispatch(clearModal())
  }

  return (
    <div className='bg-white p-8 text-left text-black' style={{ width: 440 }}>
      <div className='flex'>
        <div className='flex-grow text-3xl font-black'>{title}</div>
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
            Write Starlark Code to download, transform, and save data for your new dataset. <br/><br/> Click Dry Run to try your code. Edit code, repeat.
          </div>
        </div>
        <div className='my-12 px-8 flex'>
          <div className='text-2xl font-bold mr-3 leading-tight'>
            2.
          </div>
          <div className='text-md text-left leading-tight'>
            Once your code works, add a schedule trigger. Qri will run your automation script for you!
          </div>
        </div>
        <div className='my-12 px-8 flex'>
          <div className='text-2xl font-bold mr-3 leading-tight'>
            3.
          </div>
          <div className='text-md text-left leading-tight'>
            When you&apos;re ready, <i>Commit</i> your changes. <br/><br/>A new dataset is born!
          </div>
        </div>
      </Carousel>

      <Button id='splash_modal_workflow_button' className='mt-2' onClick={handleClose} submit block>
        Got it!  Let&apos;s go!
      </Button>
    </div>
  )
}

export default AutomationSplashModal
