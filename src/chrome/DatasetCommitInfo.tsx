import React from 'react'
import classNames from 'classnames'

import Icon from './Icon'
import RelativeTimestampWithIcon from './RelativeTimestampWithIcon'
import UsernameWithIcon from './UsernameWithIcon'
import commitishFromPath from '../utils/commitishFromPath'
import { Dataset } from '../qri/dataset'

interface DatasetCommitInfoProps {
  dataset: Dataset
  // small yields the same info with smaller text, used in collection, history list and run log
  small?: boolean
  // isRow indicates whether this is being displayed inline in a row in a list (versus in a card)
  // and is used to tweak styles
  inRow?: boolean
}

const DatasetCommitInfo: React.FC<DatasetCommitInfoProps> = ({
  dataset,
  small=false,
  inRow=false
}) => (
  <div className={classNames('truncate', {
    'text-base': !small,
    'text-sm': small
  })}>
    <div className={classNames('text-black flex justify-between items-center mb-2', {
      'font-semibold': !inRow
    })}>
      <div className='dataset_commit_info_text truncate flex-grow' title={dataset.commit?.title}>{dataset.commit?.title}</div>
      {dataset.runID && (
        <div className='flex-grow-0 text-qrigreen' title='version created by this dataset&apos;s transform script'>
          <Icon icon='automationFilled' size={small ? 'xs' : 'sm'}/>
        </div>
      )}
    </div>
    <div className='flex items-center text-qrigray-400'>
      <UsernameWithIcon username={dataset.username} tooltip className='mr-2' iconWidth={small ? 14 : 18} iconOnly={small} />
      <RelativeTimestampWithIcon className='mr-3' timestamp={new Date(dataset.commit?.timestamp)} />
      {dataset.path && (
        <div className='flex items-center leading-tight' title={dataset.path}>
          <Icon icon='commit' size={small ? 'xs' : 'sm'} className='-ml-2' />
          <div>{commitishFromPath(dataset.path)}</div>
        </div>
      )}
    </div>
  </div>
)


export default DatasetCommitInfo
