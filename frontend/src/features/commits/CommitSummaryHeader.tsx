import React from 'react'

import Dataset from '../../qri/dataset'

export interface CommitSummaryHeaderProps {
  dataset: Dataset
}

const CommitSummaryHeader: React.FC<CommitSummaryHeaderProps> = ({
  dataset,
  children
}) => {
  const { commit, path } = dataset
  return (
    <div className='min-height-200 p-4 m-4 rounded-lg bg-white'>
      <div className='float-right'>
        {children}
      </div>
      <div>
        <h4 className='text-lg font-bold'>{commit?.title}</h4>
        <div className='mt-1'>
          <span className='text-xs font-mono'>{path}</span>
        </div>
      </div>
    </div>
  )
}

export default CommitSummaryHeader
