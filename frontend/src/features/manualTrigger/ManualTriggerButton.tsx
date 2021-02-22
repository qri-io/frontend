import React from 'react'
import { useDispatch } from 'react-redux'
import ReactTooltip from 'react-tooltip'

import Button from '../../chrome/Button'
import Icon from '../../chrome/Icon'
import { manualTriggerWorkflow } from './state/manualTriggerActions'

export interface ManualTriggerButtonProps  {
  workflowID: string
}

const ManualTriggerButton: React.FC<ManualTriggerButtonProps> = ({ workflowID }) => {
  const dispatch = useDispatch()
  return (
    <div data-for={workflowID} data-tip>
      <Button
        onClick={() => { dispatch(manualTriggerWorkflow(workflowID)) }}
        size='sm'

      >
        <Icon icon='play' size='xs'/>
        <ReactTooltip
          id={workflowID}
          place='bottom'
          effect='solid'
          delayShow={500}
        >
          Run Now
        </ReactTooltip>
      </Button>
    </div>
  )
}

export default ManualTriggerButton
