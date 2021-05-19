import React from 'react'
import classNames from 'classnames'

import { RunStatus } from '../../qri/run'

interface RunStatusBadgeProps {
  status: RunStatus
}

const RunStatusBadge: React.FC<RunStatusBadgeProps> = ({ status }) => {

  let displayStatus = ''
  let colorClass = ''

  switch(status) {
    case 'waiting':
      displayStatus = 'Waiting'
      colorClass = 'text-qrinavy-300'
      break

    case 'running':
      displayStatus = 'Running'
      colorClass = 'text-qrinavy-500'
      break

    case 'succeeded':
      displayStatus = 'Success'
      colorClass = 'text-qrigreen'
      break

    case 'failed':
      displayStatus = 'Failed'
      colorClass = 'text-qripink'
      break

    case 'unchanged':
      displayStatus = 'No Changes'
      colorClass = 'text-qriblue-500'
      break
  }

  return (
    <div className={classNames('text-sm font-medium tracking-wider', colorClass)}>{displayStatus}</div>
  )
}

export default RunStatusBadge
