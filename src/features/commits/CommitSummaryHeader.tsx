// @ts-nocheck
import React from 'react'
import ContentLoader from "react-content-loader"

import Dataset from '../../qri/dataset'
import DatasetCommitInfo from '../../chrome/DatasetCommitInfo'
import { newVersionInfoFromDataset } from '../../qri/versionInfo'

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
      <div className='commit_summary_header_container flex-shrink overflow-ellipsis min-w-0 pr-3'>
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
            <DatasetCommitInfo item={newVersionInfoFromDataset(dataset)} />
          </>
          }
      </div>
      <div className='flex-grow flex-shrink-0 flex items-center justify-end'>
        {children}
      </div>
    </div>
  )
}

export default CommitSummaryHeader
