import React from 'react'

import Icon from '../../chrome/Icon'
import { RunState } from '../../qrimatic/run'

export interface RunStateIconProps {
  state: RunState
  size?: "sm" | "xs" | "md" | "lg"
}

const RunStateIcon: React.FC<RunStateIconProps> = ({ state, size='sm' }) => (
  <span id={state} className='text-sm pl-2'>
    {((s: RunState) => {
      switch (s) {
        case 'waiting':
          return <span className='text-gray-400'><Icon icon='circle' size={size}/></span>
        case 'running':
          return <span className='text-blue-500'><Icon icon='spinner' size={size} spin /></span>
        case 'succeeded':
          return <span className='text-green-500'><Icon icon='check' size={size}/></span>
        case 'failed':
          return <span className='text-red-500'><Icon icon='exclamationCircle' size={size} /></span>
        case 'skipped':
          return <span></span>
        default:
          return <span>{state}</span>
      }
    })(state)}
  </span>
)

export default RunStateIcon
