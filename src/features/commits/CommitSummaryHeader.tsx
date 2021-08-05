import React from 'react'

import Dataset from '../../qri/dataset'
import Icon from '../../chrome/Icon'
import RelativeTimestampWithIcon from '../../chrome/RelativeTimestampWithIcon'
import UsernameWithIcon from '../../chrome/UsernameWithIcon'
import commitishFromPath from '../../utils/commitishFromPath'

export interface CommitSummaryHeaderProps {
  dataset: Dataset
}

const CommitSummaryHeader: React.FC<CommitSummaryHeaderProps> = ({
  dataset,
  children
}) => {
  const { commit, path } = dataset
  if (commit) {
    return (
      <div className='min-height-200 py-4 px-8 rounded-lg bg-white flex'>
        <div className='flex-grow'>
          <div className='text-xs text-gray-400 font-medium mb-2'>Version Info</div>
          <div className='text-qrinavy font-semibold text-sm flex items-center mb-2'>
            <div className=''>{commit.title}</div>
          </div>
          <div className='flex items-center text-xs text-gray-400'>
            <UsernameWithIcon username={dataset.peername} className='mr-3' />
            <RelativeTimestampWithIcon className='mr-3' timestamp={new Date(commit.timestamp)} />
            <Icon icon='commit' size='sm' className='-ml-2' />
            <div className=''>{commitishFromPath(path)}</div>
          </div>
        </div>
        <div className='flex items-center'>
          {children}
        </div>
      </div>
    )
  }

  return null
}


export default CommitSummaryHeader
