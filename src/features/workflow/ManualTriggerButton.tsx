import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ReactTooltip from 'react-tooltip'

import Icon from '../../chrome/Icon'
import { runNow } from '../collection/state/collectionActions'
import { refStringFromQriRef } from '../../qri/ref'
import { VersionInfo } from '../../qri/versionInfo'
import { selectRun } from '../events/state/eventsState'
import { trackGoal } from '../../features/analytics/analytics'
import { cancelRun } from './state/workflowActions'
import { addWaitingEvent } from "../events/state/eventsActions"

export interface ManualTriggerButtonProps {
  row: VersionInfo
}

const ManualTriggerButton: React.FC<ManualTriggerButtonProps> = ({ row }) => {
  const { username, name, runID, initID } = row
  const dispatch = useDispatch()

  const id = refStringFromQriRef({ username, name })
  const { status } = useSelector(selectRun(runID || ''))

  const handleClick = () => {
    // collection-run-now event
    trackGoal('RXLAWMP8', 0)
    dispatch(addWaitingEvent(runID || ''))
    dispatch(runNow({ username, name }, initID))
  }

  const handleCancel = () => {
    dispatch(cancelRun(runID || ''))
  }

  const handleRun = () => {
    if (status === 'running') {
      handleCancel()
    } else if (status !== 'waiting') {
      handleClick()
    }
  }

  return (
    <div
      className='mx-auto'
      data-for={id}
      data-tip
      onClick={handleRun}
    >
      <Icon icon={ status === 'running' || status === 'waiting' ? 'circleX' : 'playCircle'} size='lg' className='text-qritile'/>
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
