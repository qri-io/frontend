import React from 'react'
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import { LogItem } from '../../qri/log';
import { newQriRef } from '../../qri/ref';
import { pathToDatasetViewer } from '../dataset/state/datasetPaths';
import ComponentChangeIndicatorGroup from './ComponentChangeIndicatorGroup';
import RelativeTimestamp from '../../chrome/RelativeTimestamp';

export interface DatasetCommitItemProps {
  logItem: LogItem
  active?: boolean
}

const DatasetCommitItem: React.FC<DatasetCommitItemProps> = ({
  logItem,
  active = false
}) => (
  <li className='relative block pl-4 mt-5 mb-6'>
    <div className='absolute top-0 -left-1.5 h-full'>
      <div className='w-3 h-3 rounded-3xl bg-gray-300'>&nbsp;</div>
      <div className='w-0.5 ml-1 mt-2 h-full bg-gray-300'>&nbsp;</div>
    </div>
    <Link className={classNames('block rounded-md p-2', active && 'bg-white')} to={pathToDatasetViewer(newQriRef(logItem))}>
      <RelativeTimestamp className='font-bold' timestamp={new Date(logItem.timestamp)} />
      <p className='truncate overflow-ellipsis'>{logItem.title || ' '}</p>
      <ComponentChangeIndicatorGroup status={[2,1,2,3,4,0]} />
    </Link>
  </li>
)

export default DatasetCommitItem
