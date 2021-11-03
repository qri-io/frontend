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
  // inRow will set the commit title to normal (instead of semibold) so it's less noisy when displayed in a row of other info
  inRow?: boolean
  // custom styles are applied if the commit info is for preview page
  preview?: boolean
  // sets the maxWidth, used for dynamic display in dataset preview page
  flex?: boolean
  // determines whether or not to show the automated icon.  This should be included in dataset, but our responses
  // are inconsistent, so this prop allows us to turn it on manually wherever we know it should appear
  automated?: boolean
}

const DatasetCommitInfo: React.FC<DatasetCommitInfoProps> = ({
  dataset,
  small = false,
  inRow = false,
  automated = false
}) => {
  return (
  <div className={classNames('truncate', {
    'text-base': !small,
    'text-sm': small
  })}>
    {/* first row (commit title) */}
    <div className={classNames('text-black flex justify-between items-center mb-2', {
      'font-semibold': !inRow
    })}>
      <div className={classNames(`dataset_commit_info_text truncate flex-grow`, {

      })} title={dataset.commit?.title}>{dataset.commit?.title}</div>
    </div>
    {/* end first row */}

    {/* second row (icons) */}
    <div className={classNames('flex items-center text-qrigray-400', {
      'text-xs': small
    })}>
      {/* automation icon */}
      {automated && (
        <div className='flex-grow-0 mr-2' title='version created by this dataset&apos;s transform script'>
          <Icon icon='automationFilled' size={small ? '2xs' : 'xs'}/>
        </div>
      )}
      {/* end automation icon */}

      {/* username icon */}
      <UsernameWithIcon username={dataset.username} tooltip className='mr-2' iconWidth={small ? 12 : 18} iconOnly={small} />
      {/* end username icon */}

      {/* relative timestamp icon */}
      {dataset.commit?.timestamp && <RelativeTimestampWithIcon className='mr-3' timestamp={new Date(dataset.commit.timestamp)} />}
      {/* end relative timestamp icon */}

      {/* commit icon */}
      {dataset.path && (
        <div className='flex items-center leading-tight' title={dataset.path}>
          <Icon icon='commit' size={small ? 'xs' : 'sm'} className='-ml-2' />
          <div>{commitishFromPath(dataset.path)}</div>
        </div>
      )}
      {/* end commit icon */}
    </div>
    {/* end second row */}
  </div>
  )
}

export default DatasetCommitInfo
