import React from 'react'

import { Run } from '../../qri/run'
import DatasetCommitInfo from '../../chrome/DatasetCommitInfo'

interface WorkflowScriptStatusProps {
  run?: Run
}

const WorkflowScriptStatus: React.FC<WorkflowScriptStatusProps> = ({
  run
}) => {
  const { dsPreview } = run

  let classes = 'border-solid border-qrigray-200 border text-qrigray-400'
  if (run?.status === 'succeeded') {
    classes = 'text-black bg-white'
  }

  return (
    <div className={`${classes} px-2 pt-2 pb-2 rounded-lg mb-5`} style={{
      minHeight: 54
    }}>
      {dsPreview && <DatasetCommitInfo dataset={dsPreview} small automated />}
    </div>
  )
}

export default WorkflowScriptStatus
