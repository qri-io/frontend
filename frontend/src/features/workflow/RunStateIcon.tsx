import React from 'react'
import { RunState } from '../../qrimatic/run'

export interface RunStateIconProps {
  state: RunState
}

const RunStateIcon: React.FC<RunStateIconProps> = ({ state }) => (
  <div>
    {((s: RunState) => {
      switch (s) {
        case 'waiting':
          return <p className='text-gray-500'>{s}</p>
        case 'running':
          return <p className='text-blue-500'>{s}</p>
        case 'succeeded':
          return <p className='text-green-500'>{s}</p>
        case 'failed':
          return <p className='text-red-500'>{s}</p>
        case 'skipped':
          return <p></p>
        default:
          return <p>{state}</p>
      }
    })(state)}
  </div>
)

export default RunStateIcon
