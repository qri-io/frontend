import React, { useEffect } from 'react'
import ReactCanvasConfetti from 'react-canvas-confetti'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import classNames from 'classnames'

import Button from '../../../chrome/Button'
import Icon from '../../../chrome/Icon'
import IconButton from '../../../chrome/IconButton'
import { clearModal, setModalLocked } from '../../app/state/appActions'

import {
  selectManualDatasetFileUploading,
  selectManualDatasetUploadError
} from "../state/manualDatasetCreationState"

export interface ManualCreationModalProps {
  username: string
  name: string
}

const ManualCreationModal: React.FC<ManualCreationModalProps> = ({
  username,
  name
}) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const fileUploading = useSelector(selectManualDatasetFileUploading)
  const uploadError = useSelector(selectManualDatasetUploadError)

  let message = {
    colorClassName: 'text-qritile-600',
    icon: 'loader',
    text: 'Creating Dataset',
    subText: 'Hang on while we process your new dataset...'
  }

  const success = !fileUploading && !uploadError
  const error = !fileUploading && uploadError

  useEffect(() => {
    dispatch(setModalLocked(true))
  }, [])

  useEffect(() => {
    if (uploadError) {
      dispatch(setModalLocked(false))
    }
  }, [uploadError])

  if (success) {
    message = {
      colorClassName: 'text-qrigreen-600',
      icon: 'circleCheck',
      text: 'Dataset Created',
      subText: 'Your new dataset is ready to go! Check out the public preview page or go to the editor to add some metadata...'
    }
  }

  if (error) {
    message = {
      colorClassName: 'text-dangerred',
      icon: 'circleX',
      text: 'Oops, Something Went Wrong',
      subText: uploadError
    }
  }

  const handleClose = () => {
    dispatch(clearModal())
  }

  const handleGoToPreviewClick = () => {
    dispatch(clearModal())
    history.push(`/${username}/${name}`)
  }

  const handleGoToEditorClick = () => {
    dispatch(clearModal())
    history.push(`/${username}/${name}/history`)
  }

  return (
    <div style={{ width: 440, height: 440 }} className='relative'>
      { error && (
        <div className='absolute top-6 right-8'>
          <IconButton icon='close' className='ml-10 mt-2' onClick={handleClose}/>
        </div>
      )}
      <div className='flex flex-col h-full w-full p-8'>
        <div className='flex-grow flex items-center mx-auto'>
          <div className='text-center'>
            <div className={classNames('mb-4', message.colorClassName)}>
              <Icon icon={message.icon} className='mb-3'/>
              <div className='text-xl font-bold'>{message.text}</div>
            </div>
            <div className='text-qrigray-400 text-sm'>{message.subText}</div>
          </div>
        </div>
        <ReactCanvasConfetti
          // set the styles as for a usual react component
          style={{
            position: 'fixed',
            width: '100%',
            height: '100%',
            zIndex: -1
          }}
          fire={success}
        />
        <div className={classNames('flex', {
          'hidden': !success
        })}>
          <Button type='primary-outline' className='mr-5' onClick={handleGoToEditorClick} block>
            Edit Metadata
          </Button>
          <Button onClick={handleGoToPreviewClick} block>
            Go to Preview
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ManualCreationModal
