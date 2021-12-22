import React from 'react'
import classNames from 'classnames'

import Icon from './Icon'
import RelativeTimestampWithIcon from './RelativeTimestampWithIcon'
import UsernameWithIcon from './UsernameWithIcon'
import commitishFromPath from '../utils/commitishFromPath'
import { VersionInfo } from '../qri/versionInfo'

interface DatasetCommitInfoProps {
  item: VersionInfo | VersionInfo
  // small yields the same info with smaller text, used in collection, history list and run log
  small?: boolean
  // inRow will set the commit title to normal (instead of semibold) so it's less noisy when displayed in a row of other info
  inRow?: boolean
  // custom styles are applied if the commit info is for preview page
  preview?: boolean
  // sets the maxWidth, used for dynamic display in dataset preview page
  flex?: boolean
  // determines if the status text will have a hover effect.
  hover?: boolean
}

const DatasetCommitInfo: React.FC<DatasetCommitInfoProps> = ({
  item,
  small = false,
  inRow = false,
  hover = false
}) => {
  return (
    <div className={classNames('truncate group', {
      'text-base': !small,
      'text-sm': small
    })}>
      {/* first row (commit title) */}
      <div className={classNames('text-black flex justify-between items-center mb-2', {
        'font-semibold': !inRow
      })}>
        <div className={classNames(`dataset_commit_info_text truncate transition-colors flex-grow ${hover && 'group-hover:underline group-hover:text-qripink-600'}`, {
        })} title={item?.commitTitle}>{item.commitTitle}</div>
      </div>
      {/* end first row */}

      {/* second row (icons) */}
      <div className={classNames('flex items-center text-qrigray-400', {
        'text-xs': small
      })}>
        {/* automation icon */}
        {item?.runID && item.runID !== '' && (
          <div className='flex-grow-0 mr-2' title='version created by this dataset&apos;s transform script'>
            <Icon icon='automationFilled' size={small ? '2xs' : 'xs'}/>
          </div>
        )}
        {/* end automation icon */}

        {/* username icon */}
        <UsernameWithIcon username={item.username} tooltip className='mr-2' iconWidth={small ? 12 : 18} iconOnly={small} />
        {/* end username icon */}

        {/* relative timestamp icon */}
        {item?.commitTime && <RelativeTimestampWithIcon className='mr-3' timestamp={new Date(item?.commitTime)} />}
        {/* end relative timestamp icon */}

        {/* commit icon */}
        {item.path && (
          <div className='flex items-center leading-tight' title={item.path}>
            <Icon icon='commit' size={small ? 'xs' : 'sm'} className='-ml-2' />
            <div>{commitishFromPath(item.path)}</div>
          </div>
        )}
        {/* end commit icon */}
      </div>
      {/* end second row */}
    </div>
  )
}

export default DatasetCommitInfo
