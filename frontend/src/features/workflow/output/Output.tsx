import React from 'react'
import { Dataset } from '../../../qri/dataset'
import { EventLogLine, EventLogLineType } from '../../../qrimatic/eventLog'
import { DatasetPreview } from './DatasetPreview'
import LogLinePrint from '../LogLinePrint'

export interface OutputProps {
  data?: EventLogLine[]
}

const Output: React.FC<OutputProps> = ({ data }) => {
  return (
  <div className='text-sm font-mono p-2 rounded-sm overflow-auto'>
    {data && data.map((line, i) => {
      switch (line.type) {
        case EventLogLineType.ETPrint:
        case EventLogLineType.ETDebug:
        case EventLogLineType.ETError:
        case EventLogLineType.ETWarn:
          return <LogLinePrint key={i} line={line} />
        case EventLogLineType.ETDataset:
          return <DatasetPreview key={i} data={line.data as Dataset}/>
        default:
          return <p key={i}>{JSON.stringify(line, undefined, 2)}</p>
      }
    })}
    &nbsp;
  </div>)
}

export default Output
