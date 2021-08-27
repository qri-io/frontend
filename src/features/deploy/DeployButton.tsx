import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Button from '../../chrome/Button'
import { AnonUser, selectSessionUser } from '../session/state/sessionState'
import { showModal } from '../app/state/appActions'
import { ModalType } from '../app/state/appState'

export interface DeployStatusDescriptionButtonProps {
  isNew: boolean
  disabled: boolean
}

const DeployButtonWithStatusDescription: React.FC<DeployStatusDescriptionButtonProps> = ({
  isNew,
  disabled
}) => {
  const dispatch = useDispatch()
  const user = useSelector(selectSessionUser)

  const handleButtonClick = () => {
    if (user === AnonUser) {
      dispatch(showModal(ModalType.signUp))
      return
    }

    dispatch(showModal(ModalType.deploy))
  }

  // TODO(chriswhong): add more validation logic to determine whether the deploy button should be disabled
  return (
    <Button
      id='deploy_workflow_button'
      type='secondary'
      className='w-full'
      onClick={handleButtonClick}
      disabled={disabled}
    >
      {isNew ? 'Deploy Workflow' : 'Deploy Changes'}
    </Button>
  )
}

export default DeployButtonWithStatusDescription
