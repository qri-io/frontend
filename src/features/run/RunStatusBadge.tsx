import React from 'react'
import classNames from 'classnames'

import { RunStatus } from '../../qri/run'
import RunStatusIcon from "./RunStatusIcon"

interface RunStatusBadgeProps {
  status: RunStatus
}

const RunStatusBadge: React.FC<RunStatusBadgeProps> = ({ status }) => {
  let displayStatus = ''
  let colorClass = ''

  switch (status) {
    case 'waiting':
      displayStatus = 'Waiting'
      colorClass = 'text-black-300'
      break

    case 'running':
      displayStatus = 'Running'
      colorClass = 'text-qrinavy-700'
      break

    case 'succeeded':
      displayStatus = 'Success'
      colorClass = 'text-qrigreen'
      break

    case 'failed':
      displayStatus = 'Failed'
      colorClass = 'text-qripink-600'
      break

    case 'unchanged':
      displayStatus = 'No Changes'
      colorClass = 'text-qritile-500'
      break
  }

  return (
    <div className={classNames('text-sm font-semibold tracking-wider flex items-center transition-colors group-hover:underline group-hover:text-qripink-600', colorClass)}>
      <RunStatusIcon className='mr-1 group-hover:text-qripink-600' size={'2xs'} status={status}/>
      {displayStatus}
    </div>
  )
}

export default RunStatusBadge
