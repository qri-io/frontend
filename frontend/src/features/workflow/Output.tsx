import React from 'react'
import { EventLogLine } from '../../qrimatic/eventLog'

export interface OutputProps {
  data?: EventLogLine[]
}

const Output: React.FC<OutputProps> = ({ data }) => {
  if (!data) {
    return null
  }

  return (
    <div className='text-sm font-mono mt-2 py-3 px-3 rounded-sm bg-gray-100'>
      {JSON.stringify(data, undefined, 2)}
    </div>
  )
}

export default Output
