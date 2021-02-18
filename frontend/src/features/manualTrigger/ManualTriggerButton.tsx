import React from 'react'
import { useDispatch } from 'react-redux'
import Button from '../../chrome/Button'
import { manualTriggerWorkflow } from './state/manualTriggerActions'

export interface ManualTriggerButtonProps  {
  workflowID: string
}

const ManualTriggerButton: React.FC<ManualTriggerButtonProps> = ({ workflowID }) => {
  const dispatch = useDispatch()
  return (<Button
    onClick={() => { dispatch(manualTriggerWorkflow(workflowID)) }}
    >Trigger Workflow</Button>)
}

export default ManualTriggerButton
