import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Icon from '../../chrome/Icon'
import { Workflow } from '../../qrimatic/workflow'
import { deployStatusInfoMap } from './deployStatus'
import { deployWorkflow } from './state/deployActions'
import { newDeployStatusSelector } from './state/deployState'

export interface DeployStatusDescriptionButtonProps {
  workflow: Workflow
}

const DeployButtonWithStatusDescription: React.FC<DeployStatusDescriptionButtonProps> = ({ workflow }) => {
  const dispatch = useDispatch()
  const status = useSelector(newDeployStatusSelector(workflow.id))
  const { statusIcon, statusIconClass, statusText, message, buttonIcon, buttonClass, buttonText } = deployStatusInfoMap[status]

  const handleButtonClick = () => {
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
      <button
        className={`w-full py-1 px-4 font-semibold shadow-md text-white rounded flex items-center justify-center ${buttonClass}`}
        onClick={handleButtonClick}
      >
        <Icon icon={buttonIcon} className='text-sm mr-2'/> {buttonText}
      </button>
    </div>
  )
}

export default DeployButtonWithStatusDescription
