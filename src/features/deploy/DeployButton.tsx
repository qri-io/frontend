import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Button from '../../chrome/Button'
import { AnonUser, selectSessionUser } from '../session/state/sessionState'
import { showModal } from '../app/state/appActions'
import { ModalType } from '../app/state/appState'
import Icon from "../../chrome/Icon";

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
      type='secondary'
      className='px-2 w-28 deploy_workflow_button'
      onClick={handleButtonClick}
      disabled={disabled}
    >
      <Icon className='mr-1.5' icon='deploy' size='sm'/>
      {isNew ? 'Deploy' : 'Re Deploy'}
    </Button>
  )
}

export default DeployButtonWithStatusDescription
