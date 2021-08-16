import React from 'react'
import { useDispatch } from 'react-redux'
import ReactTooltip from 'react-tooltip'

import Icon from '../../chrome/Icon'
import { runNow } from './state/workflowActions'
import { refStringFromQriRef, QriRef } from '../../qri/ref'

export interface ManualTriggerButtonProps  {
  qriRef: QriRef
}

const ManualTriggerButton: React.FC<ManualTriggerButtonProps> = ({ qriRef }) => {
  const dispatch = useDispatch()

  const id = refStringFromQriRef(qriRef)

  return (
    <div
      className='mx-auto'
      data-for={id}
      data-tip
      onClick={() => { dispatch(runNow(qriRef)) }}
    >
      <Icon icon='playCircle' size='lg' className='text-qriblue'/>
      <ReactTooltip
        id={id}
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
