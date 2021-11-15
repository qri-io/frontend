import React from 'react'

import { Run } from '../../qri/run'
import DatasetCommitInfo from '../../chrome/DatasetCommitInfo'
import Icon from "../../chrome/Icon"
import ContentLoader from "react-content-loader"
import { newVersionInfoFromDataset } from '../../qri/versionInfo'

interface WorkflowScriptStatusProps {
  run?: Run
}

const WorkflowScriptStatus: React.FC<WorkflowScriptStatusProps> = ({
  run
}) => {
  const dsPreview = run?.dsPreview

  let classes = 'border-solid border-qrigray-200 border text-qrigray-400'
  if (run?.status === 'succeeded') {
    classes = 'text-black bg-white'
  }

  return (
    <div className={`${classes} px-2 pt-2 pb-2 rounded-lg mb-5`} style={{
      minHeight: 54
    }}>
      {run?.status === 'running'
        ? <ContentLoader width="131" height="40" viewBox="0 0 131 40">
          <rect width="80" height="10" rx="1" fill="#D5DADD"/>
          <rect width="131" y="15" height="10" rx="1" fill="#D5DADD"/>
          <rect y="30" width="27" height="10" rx="1" fill="#D5DADD"/>
          <rect x="37" y="30" width="25" height="10" rx="1" fill="#D5DADD"/>
          <rect x="72" y="30" width="25" height="10" rx="1" fill="#D5DADD"/>
        </ContentLoader>
        : dsPreview
          ? <DatasetCommitInfo item={newVersionInfoFromDataset(dsPreview)} small />
          : <>
            <div className='text-xs flex items-center'>
              <Icon icon='playCircle' className='mr-1' size='3xs'/>
              Dry Run to Preview
            </div>
            <svg className='mt-1.5' width="131" height="25" viewBox="0 0 131 25" fill="none">
              <rect width="131" height="10" rx="1" fill="#D5DADD"/>
              <rect y="15" width="27" height="10" rx="1" fill="#D5DADD"/>
              <rect x="37" y="15" width="25" height="10" rx="1" fill="#D5DADD"/>
              <rect x="72" y="15" width="25" height="10" rx="1" fill="#D5DADD"/>
            </svg>
          </>
      }
    </div>
  )
}

export default WorkflowScriptStatus
