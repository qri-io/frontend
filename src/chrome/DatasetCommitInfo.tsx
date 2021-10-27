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
  // custom styles are applied if the commit info is for preview page
  preview?: boolean
  flex?: boolean
}

const DatasetCommitInfo: React.FC<DatasetCommitInfoProps> = ({
  dataset,
  small=false,
  inRow=false,
  preview=false,
  flex=false
}) => {
  let maxWidht = ''
  if (preview && !flex) {
    maxWidht = '220px'
  } else if (preview && flex) {
    maxWidht = '550px'
  }

  return (
  <div className={classNames('truncate', {
    'text-base': !small,
    'text-sm': small
  })}>
    {dataset.path && preview && !flex &&  (
      <div className='flex items-center leading-tight text-sm mb' title={dataset.path}>
        <Icon icon='commit' size={'xs'} className='-ml-1' />
        <div className='font-semibold'>{commitishFromPath(dataset.path)}</div>
      </div>
    )}
    <div className={classNames('text-black flex justify-between items-center mb-2', {
      'font-semibold': !inRow
    })}>
      {dataset.path && preview && flex &&  (
        <div className='flex items-center leading-tight text-sm mb border-r pr-2 mr-2' title={dataset.path}>
          <Icon icon='commit' size={'xs'} className='-ml-1' />
          <div className='font-semibold'>{commitishFromPath(dataset.path)}</div>
        </div>
      )}
      <div className={`dataset_commit_info_text ${preview && 'text-xs'} truncate flex-grow`} style={{maxWidth: maxWidht}} title={dataset.commit?.title}>{dataset.commit?.title}</div>
    </div>
    <div className={classNames('flex items-center text-qrigray-400', {
      'text-xs': small
    })}>
      {dataset.runID && (
        <div className='flex-grow-0 text-qrigreen mr-2' title='version created by this dataset&apos;s transform script'>
          <Icon icon='automationFilled' size={small ? 'xs' : 'sm'}/>
        </div>
      )}
      {preview ?
        <>
          <RelativeTimestampWithIcon className='mr-3 text-xs' timestamp={new Date(dataset.commit?.timestamp)} />
          <UsernameWithIcon username={dataset.username} tooltip className='mr-2 text-xs' iconWidth={small ? 14 : 18} iconOnly={small} />
        </>:
        <>
          <UsernameWithIcon username={dataset.username} tooltip className='mr-2' iconWidth={small ? 14 : 18} iconOnly={small} />
          <RelativeTimestampWithIcon className='mr-3' timestamp={new Date(dataset.commit?.timestamp)} />
        </>
      }

      {dataset.path && !preview &&  (
        <div className='flex items-center leading-tight' title={dataset.path}>
          <Icon icon='commit' size={small ? 'xs' : 'sm'} className='-ml-2' />
          <div>{commitishFromPath(dataset.path)}</div>
        </div>
      )}
    </div>
  </div>
)}


export default DatasetCommitInfo
