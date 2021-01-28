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
          return <span className='text-gray-500'><Icon icon='check' /></span>
        case 'running':
          return <span className='text-blue-500'><Icon icon='check' /></span>
        case 'succeeded':
          return <span className='text-green-500'><Icon icon='check' /></span>
        case 'failed':
          return <span className='text-red-500'><Icon icon='close' /></span>
        case 'skipped':
          return <span></span>
        default:
          return <span>{state}</span>
      }
    })(state)}
  </span>
)

export default RunStateIcon
