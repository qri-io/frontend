import React from 'react'
import classNames from 'classnames'

import { Dataset } from '../../../qri/dataset'
import { EventLogLine, EventLogLineType } from '../../../qri/eventLog'
import { DatasetPreview } from './DatasetPreview'
import LogLinePrint from './LogLinePrint'
import RunStatusIcon from '../../run/RunStatusIcon'
import { RunStatus } from '../../../qri/run'

export interface OutputProps {
  data?: EventLogLine[]
  status?: RunStatus
}

const Output: React.FC<OutputProps> = ({ data, status }) => {
  let borderColorClass = 'border-qrigreen'

  if (status === 'failed') {
    borderColorClass = 'border-dangerred'
  } else if(status === 'running') {
    borderColorClass = 'border-qrinavy-700'
  }

  return (
    <div className='relative'>
      <div className='rounded-xl absolute bg-white inline-block flex items-center justify-center' style={{
        top: -8,
        left: 10,
        height: 18,
        width: 18
      }}>
        <RunStatusIcon status={status} size='2xs' />
      </div>
      <div className={classNames('output font-mono px-5 py-4 rounded-sm overflow-x-hidden border-2 rounded-b-md bg-white', borderColorClass)}>
        {data && data.map((line, i) => {
          switch (line.type) {
            case EventLogLineType.ETPrint:
            case EventLogLineType.ETError:
              return <LogLinePrint key={i} line={line} />
            case EventLogLineType.ETDatasetPreview:
              return <DatasetPreview key={i} data={line.data as Dataset}/>
            default:
              return <p key={i}>{JSON.stringify(line, undefined, 2)}</p>
          }
        })}
        {status === 'running' && <p className='text-qrinavy-700 text-sm'>Running...</p>}
        &nbsp;
      </div>
    </div>
  )
}

export default Output
