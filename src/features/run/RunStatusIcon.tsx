import React from 'react'

import Icon from '../../chrome/Icon'
import { RunStatus } from '../../qri/run'

export interface RunStatusIconProps {
  state: RunStatus
  size?: "sm" | "xs" | "md" | "lg"
}

const RunStatusIcon: React.FC<RunStatusIconProps> = ({ state, size='sm' }) => (
  <span className='text-sm pl-2'>
    {((s: RunStatus) => {
      switch (s) {
        case 'waiting':
          return <span className='text-gray-400'><Icon icon='circle' size={size}/></span>
        case 'running':
          return <span className='text-blue-500'><Icon icon='spinner' size={size} spin /></span>
        case 'succeeded':
          return <span className='text-green-500'><Icon icon='check' size={size}/></span>
        case 'failed':
          return <span className='text-red-500'><Icon icon='exclamationCircle' size={size} /></span>
        case 'unchanged':
          // TODO(b5): consider an icon for "cached" here?
          return <span className='text-blue-500'><Icon icon='minusCircle' size={size} spin /></span>
        case 'skipped':
          return <span className='text-blue-500'><Icon icon='minusCircle' size={size} spin /></span>
        case '':
          return null
      }
    })(state)}
  </span>
)

export default RunStatusIcon
