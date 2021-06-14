import React from 'react'
import { useDispatch } from 'react-redux'
import ReactTooltip from 'react-tooltip'

import Icon from '../../chrome/Icon'
import { manualTriggerWorkflow } from './state/manualTriggerActions'

export interface ManualTriggerButtonProps  {
  workflowID: string
}

const ManualTriggerButton: React.FC<ManualTriggerButtonProps> = ({ workflowID }) => {
  const dispatch = useDispatch()
  return (
    <div
      className='mx-auto'
      data-for={workflowID}
      data-tip
      onClick={() => { dispatch(manualTriggerWorkflow(workflowID)) }}
    >
      <Icon icon='playCircle' size='lg' className='text-qriblue'/>
      <ReactTooltip
        id={workflowID}
        place='bottom'
        effect='solid'
        delayShow={500}
      >
        Run Now
      </ReactTooltip>
    </div>
  )
}

export default ManualTriggerButton
