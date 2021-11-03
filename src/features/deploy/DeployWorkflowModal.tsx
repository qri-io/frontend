// @ts-nocheck
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import ModalLayout from '../app/modal/ModalLayout'

import { deployWorkflow } from './state/deployActions'
import { selectWorkflow } from '../workflow/state/workflowState'

const DeployWorkflowModal: React.FC = () => {
  const dispatch = useDispatch()
  const workflow = useSelector(selectWorkflow)

  return (
    <ModalLayout
      title='Deploy Workflow'
      type='info'
      icon='ship'
      actionButtonText='Deploy!'
      action={() => { dispatch(deployWorkflow(workflow)) }}
    >
      <p className='mb-4'>After deployment, Qrimatic will run your job according the triggers you&apos;ve defined.</p>
      <p><input type='checkbox' checked disabled /> Run &amp; save before deploying</p>
    </ModalLayout>
  )
}

export default DeployWorkflowModal
