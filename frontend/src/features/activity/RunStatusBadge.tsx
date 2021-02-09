import React from 'react'

import Icon from '../../chrome/Icon'

interface RunStatusBadgeProps {
  status: "success" | "error" | "no-changes" | "manual-commit"
}

const RunStatusBadge: React.FC<RunStatusBadgeProps> = ({ status }) => {

  let icon = ''
  let displayStatus = ''
  let backgroundClass = ''
  let size = 'md'

  switch(status) {
    case 'success':
      icon = 'checkCircle'
      displayStatus = 'Success'
      backgroundClass = 'bg-green-500'
      break

    case 'error':
      icon = 'exclamationCircle'
      displayStatus = 'Failed'
      backgroundClass = 'bg-red-500'
      break

    case 'no-changes':
      icon = 'minusCircle'
      displayStatus = 'No Changes'
      backgroundClass = 'bg-blue-500'
      break

    case 'manual-commit':
      icon = 'pen'
      displayStatus = 'Manual Edit'
      backgroundClass = 'bg-gray-500'
      size = 'sm'
      break
  }

  return (
    <div className={`${backgroundClass} text-white font-semibold flex items-center py-1 px-2 rounded-xl`}>
      <Icon icon={icon} className='text-white mr-1' size={size} /> {displayStatus}
    </div>
  )
}

export default RunStatusBadge
