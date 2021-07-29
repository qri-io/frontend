import React from 'react'
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import { LogItem } from '../../qri/log';
import { newQriRef } from '../../qri/ref';
import { pathToDatasetViewer } from '../dataset/state/datasetPaths';
// import ComponentChangeIndicatorGroup from './ComponentChangeIndicatorGroup';
import RelativeTimestampWithIcon from '../../chrome/RelativeTimestampWithIcon';
import UsernameWithIcon from '../../chrome/UsernameWithIcon';

import Icon from '../../chrome/Icon';

export interface DatasetCommitProps {
  logItem: LogItem
  active?: boolean
  isLink?: boolean
}

const DatasetCommit: React.FC<DatasetCommitProps> = ({
  logItem,
  active = false,
  isLink = true
}) => {
  const content = (
    <>
      <div className='flex justify-between'>
        <div className='font-medium mb-1 pr-2'>{logItem.title}</div>
        <div className='flex-grow-0 text-qrigreen'>
          <Icon icon='automationFilled' size='sm'/>
        </div>
      </div>
      <div className='flex flex-col text-qrigray-400'>
        <div className='mb-1'>{logItem.username && <UsernameWithIcon username={logItem.username} iconWidth={14} className='mr-2' />}</div>
        <RelativeTimestampWithIcon timestamp={new Date(logItem.timestamp)} />
      </div>
      {/* TODO(chriswhong): restore when we can add component change indicators <ComponentChangeIndicatorGroup status={[2,1,2,3,4]} />*/}
    </>
  )

  const containerClassNames = classNames('block rounded-md px-3 py-3 mb-6 w-full overflow-x-hidden', active && 'bg-white', !active && 'text-qrigray-400 border border-qrigray-300')

  if (isLink) {
    return (
      <Link
        className={containerClassNames}
        to={pathToDatasetViewer(newQriRef(logItem))}
        style={{ fontSize: 11 }}
      >
        {content}
      </Link>
    )
  }

  return (
    <div
      className={containerClassNames}
      style={{ fontSize: 11 }}
    >
      {content}
    </div>
  )

}


export default DatasetCommit
