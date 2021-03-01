import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Icon from '../../chrome/Icon'
import Button from '../../chrome/Button'
import { Workflow } from '../../qrimatic/workflow'
import { deployStatusInfoMap } from './deployStatus'
import { deployWorkflow } from './state/deployActions'
import { newDeployStatusSelector } from './state/deployState'
import { NewUser, selectSessionUser } from '../session/state/sessionState'
import { showModal } from '../app/state/appActions'
import { ModalType } from '../app/state/appState'

export interface DeployStatusDescriptionButtonProps {
  workflow: Workflow
}

const DeployButtonWithStatusDescription: React.FC<DeployStatusDescriptionButtonProps> = ({ workflow }) => {
  const dispatch = useDispatch()
  const status = useSelector(newDeployStatusSelector(workflow.id))
  const user = useSelector(selectSessionUser)
  const { statusIcon, statusIconClass, statusText, message, buttonIcon, buttonClass, buttonText } = deployStatusInfoMap[status]

  const handleButtonClick = () => {
    if (user === NewUser) {
      dispatch(showModal(ModalType.signUp))
      return
    }

    switch (status) {
      case 'undeployed': // undeployed -> deploy
        dispatch(deployWorkflow(workflow))
        break;
      case 'deployed': // deployed -> pause
        alert('pausing workflow not yet implemented');
        break
      case 'deploying': // deploying -> cancel
        alert('cancelling workflow deploy not yet implemented')
        break;
      case 'drafting': // drafting -> deploy
        break;
      case 'paused': // paused -> deploy ("unpause")
        dispatch(deployWorkflow(workflow))
        break;
    }
  }

  return (
    <div className='py-4 pl-4'>
      <div className='mb-2' >
        <Icon icon={statusIcon} className={`text-gray-300 mr-3 ${statusIconClass}`} size='md' />
        <span className='text-sm font-semibold text-gray-600'>{statusText}</span>
      </div>
      <div className='text-xs mb-4'>{message}</div>
      <Button
        className={`w-full  ${buttonClass}`}
        onClick={handleButtonClick}
      >
        <Icon icon={buttonIcon} className='text-sm mr-2'/> {buttonText}
      </Button>
    </div>
  )
}

export default DeployButtonWithStatusDescription
