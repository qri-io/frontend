import React from 'react'
import classNames from 'classnames'

import { LogItem } from '../../qri/log'
import DatasetCommit from './DatasetCommit'

export interface DatasetCommitListItemProps {
  logItem: LogItem
  loading?: boolean
  active?: boolean
  first?: boolean
  last?: boolean
}

const DatasetCommitListItem: React.FC<DatasetCommitListItemProps> = ({
  logItem,
  loading = false,
  active = false,
  first = false,
  last = false
}) => (
  <li className='flex items-stretch text-black tracking-wider'>
    <div className='relative w-4 mr-5 flex-shrink-0'>
      <div className={classNames('absolute top-5 w-4 h-4 rounded-3xl bg-gray-300', active && 'bg-qripink')}>&nbsp;</div>
      <div className='relative line-container w-0.5 mx-auto h-full'>
        {!first && <div className='absolute top-0 w-full h-3 bg-gray-300 rounded'>&nbsp;</div>}
        {!last && <div className='absolute top-11 bottom-0 w-full bg-gray-300 rounded'>&nbsp;</div>}
      </div>
    </div>
    <DatasetCommit loading={loading} logItem={logItem} active={active} />
  </li>
)

export default DatasetCommitListItem
