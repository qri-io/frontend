import React from 'react'

import Icon, { IconSize } from '../../chrome/Icon'
import { RunStatus } from '../../qri/run'

interface RunStatusBadgeProps {
  status: RunStatus
  size?: 'md' | 'sm' | 'xs'
}

const RunStatusBadge: React.FC<RunStatusBadgeProps> = ({ status, size = 'md' }) => {

  let icon = ''
  let displayStatus = ''
  let backgroundClass = ''
  let iconSize: IconSize = 'md'
  let spin = false
  let yPaddingClass = 'py-1'

  switch(status) {
    case 'waiting':
      break
    case 'running':
      icon = 'spinner'
      displayStatus = 'Running'
      backgroundClass = 'bg-blue-500'
      spin = true
      break

    case 'succeeded':
      icon = 'checkCircle'
      displayStatus = 'Success'
      backgroundClass = 'bg-green-500'
      break

    case 'failed':
      icon = 'exclamationCircle'
      displayStatus = 'Failed'
      backgroundClass = 'bg-red-500'
      break

    case 'unchanged':
      icon = 'minusCircle'
      displayStatus = 'No Changes'
      backgroundClass = 'bg-blue-500'
      break
    default:
      icon = 'pen'
      displayStatus = 'Manual Edit'
      backgroundClass = 'bg-gray-500 pl-2' // additional left padding for pen icon
      iconSize = 'sm'
      break
  }

  if (size === 'sm') {
    iconSize = 'sm'
    yPaddingClass = 'py-0.5'
  } else if (size === 'xs') {
    iconSize = 'sm'
  }

  return (
    <div className={`${backgroundClass} text-white font-semibold flex items-center ${yPaddingClass} pl-1 pr-1 rounded-xl`}>
      <Icon icon={icon} className='text-white' size={iconSize} spin={spin} /> {size !== 'xs' && (<div className='ml-1'>{displayStatus}</div>)}
    </div>
  )
}

export default RunStatusBadge
