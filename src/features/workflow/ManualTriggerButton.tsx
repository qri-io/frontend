import React, { useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ReactTooltip from 'react-tooltip'

import Icon from '../../chrome/Icon'
import { runNow, loadCollection } from '../collection/state/collectionActions'
import { refStringFromQriRef } from '../../qri/ref'
import { VersionInfo } from '../../qri/versionInfo'
import { selectRun } from '../events/state/eventsState'


export interface ManualTriggerButtonProps  {
  row: VersionInfo
}

const ManualTriggerButton: React.FC<ManualTriggerButtonProps> = ({ row }) => {
  const { username, name, runID, initID } = row
  const dispatch = useDispatch()

  const id = refStringFromQriRef({ username, name })
  const { status } = useSelector(selectRun(runID))

  const handleClick = () => {
    dispatch(runNow({ username, name }, initID))
  }

  const statusRef = useRef(status);

  // when status changes from 'running' to 'succeeded', refresh the collection state
  useEffect(() => {
    if ((statusRef.current === 'running') && (status === 'succeeded')) {
      dispatch(loadCollection())
    }

    statusRef.current = status
  }, [dispatch, status])

  return (
    <div
      className='mx-auto'
      data-for={id}
      data-tip
      onClick={handleClick}
    >
      <Icon icon={ status === 'running' ? 'loader' : 'playCircle'} size='lg' className='text-qritile'/>
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
