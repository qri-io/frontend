import React from 'react'

import { RunStatus } from '../../qri/run'

interface WorkflowStepStatusCircleProps {
  status: RunStatus
}

interface StatusMapping {
  classes: string
}

type StatusMappings = {
  [key in RunStatus]: StatusMapping
}

const statusMappings: StatusMappings = {
  waiting: {
    classes: 'border border-solid border-qrigray-400'
  },
  running: {
    classes: 'bg-qrigray-400'
  },
  succeeded: {
    classes: 'bg-green-600'
  },
  failed: {
    classes: 'bg-dangerred'
  },
  unchanged: {
    classes: 'bg-blue'
  },
  skipped: {
    classes: 'border border-solid border-qrigray-400'
  },
  '': {
    classes: 'border border-solid border-qrigray-400'
  }
}

const WorkflowStepStatusCircle: React.FC<WorkflowStepStatusCircleProps> = ({
  status
}) => {
  const { classes } = statusMappings[status]
  return (
    <div className={`mx-1 mb-1 rounded-lg h-2 w-5 ${classes}`} />
  )
}

export default WorkflowStepStatusCircle
