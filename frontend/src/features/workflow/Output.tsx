import React from 'react'
import { EventLogLine, EventLogLineType } from '../../qrimatic/eventLog'
import LogLinePrint from './LogLinePrint'

export interface OutputProps {
  data?: EventLogLine[] | null
}

const Output: React.FC<OutputProps> = ({ data }) => {
  return (
  <div className='text-sm font-mono p-2 rounded-sm bg-gray-100'>
    <div className='text-xs font-bold'>OUTPUT</div>
    {data && data.map((line, i) => {
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
    {!data && 'This cell hasn\'t been run yet'}
  </div>)
}

export default Output
