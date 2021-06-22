import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Button from '../../chrome/Button'
import { Workflow } from '../../qrimatic/workflow'
import { deployStatusInfoMap } from './deployStatus'
import { deployWorkflow } from './state/deployActions'
import { newDeployStatusSelector } from './state/deployState'
import { AnonUser, selectSessionUser } from '../session/state/sessionState'
import { showModal } from '../app/state/appActions'
import { ModalType } from '../app/state/appState'

export interface DeployStatusDescriptionButtonProps {
  workflow: Workflow
}

const DeployButtonWithStatusDescription: React.FC<DeployStatusDescriptionButtonProps> = ({ workflow }) => {
  const dispatch = useDispatch()
  const status = useSelector(newDeployStatusSelector(workflow.id))
  const user = useSelector(selectSessionUser)
  const { buttonText } = deployStatusInfoMap[status]

  const handleButtonClick = () => {
    if (user === AnonUser) {
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
    <Button
      type='secondary'
      className={`w-full`}
      onClick={handleButtonClick}
    >
      {buttonText}
    </Button>
  )
}

export default DeployButtonWithStatusDescription
