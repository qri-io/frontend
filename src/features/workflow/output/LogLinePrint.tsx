import React from 'react'
import { EventLogLine, EventLogLineType } from '../../../qri/eventLog'

export interface LogLineProps {
  line: EventLogLine
  scrollToError: (v: Record<string, any>) => void
}

const LogLinePrint: React.FC<LogLineProps> = ({ line, scrollToError }) => {
  switch (line.type) {
    case EventLogLineType.ETPrint:
      // TODO (b5) - utilize line.data.lvl to set output colour
      return <p className='log_line_print_text text-sm whitespace-pre-wrap text-gray-500'>{line.data.msg}</p>
    case EventLogLineType.ETError:
      return <p onClick={() => scrollToError(line.data)} className='text-sm whitespace-pre-wrap text-dangerred hover:cursor-pointer'>{line.data.msg}</p>
    default:
      return <p className='whitespace-pre-wrap'>{line.data.msg}</p>
  }
}

export default LogLinePrint
