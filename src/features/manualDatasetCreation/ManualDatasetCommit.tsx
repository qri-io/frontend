import React from "react"
import { useSelector } from "react-redux"

import DatasetCommitInfo from "../../chrome/DatasetCommitInfo"
import { NewCommit, NewDataset } from "../../qri/dataset"
import { UserProfile } from "../../qri/userProfile"
import Icon from "../../chrome/Icon"
import CompletionCheckmark from "./CompletionCheckmark"
import { selectManualDatasetCommitTitle } from "./state/manualDatasetCreationState"
import { newVersionInfoFromDataset } from "../../qri/versionInfo"

interface ManualDatasetCommitProps {
  user: UserProfile
}

const ManualDatasetCommit: React.FC<ManualDatasetCommitProps> = ({ user }) => {
  const commitTitle = useSelector(selectManualDatasetCommitTitle)
  const dataset = NewDataset({
    username: user.username,
    path: '',
    commit: NewCommit({
      title: commitTitle,
      timestamp: '-'
    })
  })

  return (
    <div style={{ width: 265 }} className='flex-shrink-0 pr-8'>
      <h3 className='font-bold text-2xl'>New manual dataset</h3>
      <p className='text-sm text-qrigray-400'>You are making a new dataset</p>
      <div className='flex mt-4'>
        <Icon icon='dashedCircle' className='text-qripink-600 mr-3 mt-3' size='xs'/>
        <div className='block flex-grow rounded-md px-3 py-3 mb-6 overflow-x-hidden bg-white flex-shrink-0'>
          <DatasetCommitInfo item={newVersionInfoFromDataset(dataset)} small />
          <div className='flex mt-2 justify-between'>
            <CompletionCheckmark active={false}/>
            <CompletionCheckmark active={false}/>
            <CompletionCheckmark active={false}/>
            <CompletionCheckmark active={false}/>
            <CompletionCheckmark active={false}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManualDatasetCommit
