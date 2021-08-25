import React from 'react'
import classNames from 'classnames'

import Icon from './Icon'
import RelativeTimestampWithIcon from './RelativeTimestampWithIcon'
import UsernameWithIcon from './UsernameWithIcon'
import commitishFromPath from '../utils/commitishFromPath'
import { Dataset } from '../qri/dataset'

interface DatasetCommitInfoProps {
  dataset: Dataset
  // small yields the same info with smaller text, used in history list and run log
  small?: boolean
}

const DatasetCommitInfo: React.FC<DatasetCommitInfoProps> = ({
  dataset,
  small=false
}) => {
  return (
    <div className={classNames({
      'text-sm': !small,
      'text-xs': small
    })}>
      <div className={classNames('text-qrinavy font-semibold flex justify-between items-center mb-2')}>
        <div>{dataset.commit?.title}</div>
        <div className='flex-grow-0 text-qrigreen'>
          <Icon icon='automationFilled' size={small ? 'xs' : 'sm'}/>
        </div>
      </div>
      <div className='flex items-center text-gray-400'>
        <UsernameWithIcon username={dataset.username} className='mr-2' iconWidth={small ? 14 : 18} iconOnly={small} />
        <RelativeTimestampWithIcon className='mr-3' timestamp={new Date(dataset.commit?.timestamp)} />
        {dataset.path && (
          <div className='flex items-center leading-tight'>
            <Icon icon='commit' size={small ? 'xs' : 'sm'} className='-ml-2' />
            <div>{commitishFromPath(dataset.path)}</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DatasetCommitInfo
