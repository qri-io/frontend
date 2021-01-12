import React from 'react'
import { EventLogLine, EventLogLineType } from '../../qrimatic/eventLog'

export interface LogLineProps {
  line: EventLogLine
}

const LogLinePrint: React.FC<LogLineProps> = ({ line }) => {
  switch (line.type) {
    case EventLogLineType.ETWarn:
     return <p className='text-yellow-500'>{line.data.msg}</p>
    case EventLogLineType.ETDebug:
     return <p className='text-gray-500'>{line.data.msg}</p>
    case EventLogLineType.ETError:
     return <p className='text-red-500'>{line.data.msg}</p>
    default:
      return <p>{line.data.msg}</p>
  }
}

export default LogLinePrint
