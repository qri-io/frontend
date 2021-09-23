import React from 'react'

import { Run, RunStatus } from '../../qri/run'

interface WorkflowScriptStatusProps {
  run?: Run
}

interface StatusMapping {
  classes: string
}

type StatusMappings = {
  [key in RunStatus]: StatusMapping
}

const statusMappings: StatusMappings = {
  waiting: {
    classes: 'border-solid border-qrigray-200 border text-gray-400'
  },
  running: {
    classes: 'border-solid border-qrigray-200 border text-gray-400'
  },
  succeeded: {
    classes: 'text-black bg-white'
  },
  failed: {
    classes: 'border-solid bg-white border-dangerred border text-black'
  },
  unchanged: {
    classes: 'bg-blue'
  },
  skipped: {
    classes: 'border-solid border-qrigray-200 border text-gray-400'
  },
  '': {
    classes: 'border-solid border-qrigray-200 border text-gray-400'
  }
}

const WorkflowScriptStatus: React.FC<WorkflowScriptStatusProps> = ({
  run
}) => {
  const { classes } = statusMappings[run?.status || '']
  return (
    <div className={`${classes} px-2 pt-2 pb-2 rounded-lg mb-5`}>
      <div className='mb-2 text-xs tracking-wide'>New Preview Version</div>
    </div>
  )
}

export default WorkflowScriptStatus
