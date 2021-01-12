import React from 'react'
import { EventLogLine, EventLogLineType } from '../../qrimatic/eventLog'
import LogLinePrint from './LogLinePrint'

export interface OutputProps {
  data?: EventLogLine[]
}

const Output: React.FC<OutputProps> = ({ data }) => {
  if (!data) {
    return null
  }

  return (
  <div className='text-sm font-mono mt-2 py-3 px-3 rounded-sm bg-gray-100'>
    {data.map((line, i) => {
      switch (line.type) {
        case EventLogLineType.ETPrint:
        case EventLogLineType.ETDebug:
        case EventLogLineType.ETError:
        case EventLogLineType.ETWarn:
          return <LogLinePrint key={i} line={line} />
        default:
          return <p key={i}>{JSON.stringify(line, undefined, 2)}</p>
      }
    })}
  </div>)
}

export default Output
