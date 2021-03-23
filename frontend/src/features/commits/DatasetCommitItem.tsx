import React from 'react'
import RelativeTimestamp from '../../chrome/RelativeTimestamp';

import { LogItem } from '../../qri/log';
import ComponentChangeIndicatorGroup from './ComponentChangeIndicatorGroup';

export interface DatasetCommitItemProps {
  logItem: LogItem
}

const DatasetCommitItem: React.FC<DatasetCommitItemProps> = ({
  logItem,
}) => (
  <li className='relative block pl-4 mt-7 mb-6'>
    <div className='absolute top-0 -left-1.5 h-full'>
      <div className='w-3 h-3 rounded-3xl bg-gray-300'>&nbsp;</div>
      <div className='w-0.5 ml-1 mt-2 h-full bg-gray-300'>&nbsp;</div>
    </div>
    <div>
      <RelativeTimestamp className='font-bold' timestamp={new Date(logItem.timestamp)} />
      <p className='truncate overflow-ellipsis'>{logItem.title || ' '}</p>
      <ComponentChangeIndicatorGroup status={[2,1,2,3,4,0]} />
    </div>
  </li>
)

export default DatasetCommitItem
