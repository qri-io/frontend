import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import Button from '../../../chrome/Button'
import Icon from '../../../chrome/Icon'
import { clearModal } from '../../app/state/appActions'
import CloseButton from '../../../chrome/CloseButton'
import TextInput from '../../../chrome/forms/TextInput'
// import { saveAndApplyWorkflowTransform } from '../state/workflowActions'
import { selectWorkflowQriRef } from '../state/workflowState'
import { validateDatasetName } from '../../session/state/formValidation'

const DeployModal: React.FC = () => {
  const dispatch = useDispatch()
  const qriRef = useSelector(selectWorkflowQriRef)

  // determine if the workflow is new by reading /new at the end of the pathname
  const segments = useLocation().pathname.split('/')
  const isNew = segments[segments.length - 1] === 'new'

  const originalDsName = (' ' + qriRef.name).slice(1)

  const [ dsName, setDsName ] = useState(qriRef.name)
  const [ dsNameError, setDsNameError ] = useState()

  const handleClose = () => {
    dispatch(clearModal())
  }

  const handleDsNameChange = (value: string) => {
    //validate the dataset name
    const err = validateDatasetName(value)
    setDsNameError(err)
    setDsName(value)
  }

  // determine whether all conditions are met for proceeding
  const checkReadyToDeploy = () => {
    let ready = true

    if (isNew) {
      if (dsName === originalDsName) {
        ready = false
      }

      if (dsName.length === 0) {
        ready = false
      }
    }

    return ready
  }

  const readyToDeploy = checkReadyToDeploy()

  console.log(readyToDeploy)

  const handleDeployClick = () => {
    alert('Deploy!')
    //TODO(chriswhong): figure out actions on deploy
    // dispatch(saveAndApplyWorkflowTransform())
  }

  let heading = 'You\'re almost there!'
  let subHeading = 'We need one more thing before you can deploy'

  let content = (
    <div className='text-sm'>
      <div className='text-qrinavy font-semibold mb-1'>Dataset name *</div>
      <div className='text-qrigray-400 mb-2'>Give your dataset a descriptive, machine-friendly name</div>
      <TextInput
        name='dsName'
        value={dsName}
        onChange={handleDsNameChange}
        error={dsNameError}
      />
    </div>
  )

  // if not new, we don't need to ask for a rename
  if (!isNew) {
    heading = 'Ready to Deploy!'
    subHeading = 'Confirm your settings and mash that deploy button'
    content = <></>
  }

  return (
    <div className='bg-white p-8 text-left text-qrinavy' style={{ width: '440px'}}>
      <div className='flex'>
        <div className='flex-grow text-3xl font-black mb-6'>{heading}</div>
        <CloseButton className='ml-10' onClick={handleClose}/>
      </div>
      <div className='mb-6'>
        <div className='mb-3'>{subHeading}</div>

        {content}
        {/* TODO(chriswhong): add other predeployment checks like triggers and completion tasks */}
      </div>
      <Button
        size='sm'
        type='secondary'
        className='w-full mt-2'
        onClick={handleDeployClick}
        submit
        disabled={!readyToDeploy}>
        <Icon icon='rocket' className='mr-2' /> Deploy
      </Button>
    </div>
  )
}

export default DeployModal
