import React from 'react'
import { EventLogLine, EventLogLineType } from '../../../qri/eventLog'

export interface LogLineProps {
  line: EventLogLine
}

const LogLinePrint: React.FC<LogLineProps> = ({ line }) => {
  switch (line.type) {
    case EventLogLineType.ETPrint:
      // TODO (b5) - utilize line.data.lvl to set output colour
     return <p className='log_line_print_text text-sm text-gray-500'>{line.data.msg}</p>
    case EventLogLineType.ETError:
     return <p className='text-sm text-qrired-700'>{line.data.msg}</p>
    default:
      return <p>{line.data.msg}</p>
  }
}

export default LogLinePrint
