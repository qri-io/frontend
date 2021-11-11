// @ts-nocheck
import React from 'react'
import ContentLoader from "react-content-loader"

import Dataset from '../../qri/dataset'
import DatasetVersionInfo from '../../chrome/DatasetCommitInfo'

export interface CommitSummaryHeaderProps {
  dataset: Dataset
  loading?: boolean
}

const CommitSummaryHeader: React.FC<CommitSummaryHeaderProps> = ({
  dataset,
  loading = false,
  children
}) => {
  const { commit } = dataset
  if (!commit && !loading) {
    return null
  }

  return (
    <div className='min-height-200 py-4 px-8 rounded-lg bg-white flex'>
      <div className='commit_summary_header_container'>
        { loading
          ? <>
            <div className='text-sm text-qrigray-400 font-semibold mb-2'>Version Info</div>
            <ContentLoader width="421" height="48.6" fill="none">
              <rect y="4" width="421" height="12" fill="#D5DADD"/>
              <rect y="32" width="89" height="12" fill="#D5DADD"/>
              <rect x="99" y="32" width="89" height="12" fill="#D5DADD"/>
            </ContentLoader>
          </>
          : <>
            <div className='text-sm text-qrigray-400 font-semibold mb-2'>Version Info</div>
            <DatasetVersionInfo dataset={dataset} automated={dataset.commit.runID !== ''} />
          </>
          }
      </div>
      <div className='flex-grow flex items-center justify-end'>
        {children}
      </div>
    </div>
  )
}

export default CommitSummaryHeader
