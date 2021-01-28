import React from 'react'

import Icon from '../../chrome/Icon'
import { RunState } from '../../qrimatic/run'

export interface RunStateIconProps {
  state: RunState
}

const RunStateIcon: React.FC<RunStateIconProps> = ({ state }) => (
  <span className='text-sm pl-2'>
    {((s: RunState) => {
      switch (s) {
        case 'waiting':
          return <span className='text-gray-400'><Icon icon='circle' size='sm'/></span>
        case 'running':
          return <span className='text-blue-500'><Icon icon='spinner' size='sm' spin /></span>
        case 'succeeded':
          return <span className='text-green-500'><Icon icon='check' size='sm'/></span>
        case 'failed':
          return <span className='text-red-500'><Icon icon='exclamationCircle' size='sm' /></span>
        case 'skipped':
          return <span></span>
        default:
          return <span>{state}</span>
      }
    })(state)}
  </span>
)

export default RunStateIcon
