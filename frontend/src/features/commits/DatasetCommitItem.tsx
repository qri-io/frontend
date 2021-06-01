import React from 'react'
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import { LogItem } from '../../qri/log';
import { newQriRef } from '../../qri/ref';
import { pathToDatasetViewer } from '../dataset/state/datasetPaths';
import ComponentChangeIndicatorGroup from './ComponentChangeIndicatorGroup';
import RelativeTimestampWithIcon from '../../chrome/RelativeTimestampWithIcon';
import UsernameWithIcon from '../../chrome/UsernameWithIcon';

import Icon from '../../chrome/Icon';

export interface DatasetCommitItemProps {
  logItem: LogItem
  active?: boolean
  first?: boolean
  last?: boolean
}

const DatasetCommitItem: React.FC<DatasetCommitItemProps> = ({
  logItem,
  active = false,
  first = false,
  last = false
}) => (
    <li className='flex items-stretch text-qrinavy tracking-wider'>
      <div className='relative w-4 mr-5 flex-shrink-0'>
        <div className={classNames('absolute top-5 w-4 h-4 rounded-3xl bg-gray-300', active && 'bg-qripink')}>&nbsp;</div>
        <div className='relative line-container w-0.5 mx-auto h-full'>
          {!first && <div className='absolute top-0 w-full h-3 bg-gray-300 rounded'>&nbsp;</div>}
          {!last && <div className='absolute top-11 bottom-0 w-full bg-gray-300 rounded'>&nbsp;</div>}
        </div>
      </div>
      <Link className={classNames('block rounded-md p-4 mb-6 w-full overflow-x-hidden', active && 'bg-white', !active && 'text-gray-400 border border-gray-300')} to={pathToDatasetViewer(newQriRef(logItem))}>
        <div className='flex mb-1 justify-between'>
          <UsernameWithIcon username={logItem.username} />
          <div className='flex-grow-0 text-qrigreen'>
            <Icon icon='automationFilled' size='sm'/>
          </div>
        </div>
        <RelativeTimestampWithIcon className='mb-2' timestamp={new Date(logItem.timestamp)} />
        {/* TODO(chriswhong): in case we want to restore commit title */}
        {/* <p className='truncate overflow-ellipsis'>{logItem.title || ' '}</p> */}
        <ComponentChangeIndicatorGroup status={[2,1,2,3,4]} />
      </Link>
    </li>
  )

export default DatasetCommitItem
