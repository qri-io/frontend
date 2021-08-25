import React from 'react'

import Dataset from '../../qri/dataset'
import DatasetVersionInfo from '../../chrome/DatasetCommitInfo'

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
        <div className=''>
          <div className='text-xs text-gray-400 font-medium mb-2'>Version Info</div>
          <DatasetVersionInfo dataset={dataset} />
        </div>
        <div className='flex-grow flex items-center justify-end'>
          {children}
        </div>
      </div>
    )
  }

  return null
}


export default CommitSummaryHeader
