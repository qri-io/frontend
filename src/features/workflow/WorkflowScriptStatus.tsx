import React from "react";

import {NewRunStep, Run, RunStatus} from "../../qri/run";
import {Dataset, TransformStep} from "../../qri/dataset";
import WorkflowStepStatusCircle from "./WorkflowStepStatusCircle";

interface WorkflowCellControlsProps {
  dataset: Dataset
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
    classes: 'border-solid border-gray-200 border text-gray-400'
  },
  running: {
    classes: 'border-solid border-gray-200 border text-gray-400'
  },
  succeeded: {
    classes: 'text-black bg-white'
  },
  failed: {
    classes: 'border-solid bg-white border-dangerred border text-black'
  },
  unchanged: {
    classes:  'bg-blue'
  },
  skipped: {
    classes: 'border-solid border-gray-200 border text-gray-400'
  },
  '': {
    classes: 'border-solid border-gray-200 border text-gray-400'
  }
}

const WorkflowScriptStatus: React.FC<WorkflowCellControlsProps> = ({
  dataset,
  run
}) => {
  const { classes } = statusMappings[run?.status || ''];
  return (
    <div className={`${classes} px-2 pt-2 pb-2 rounded-lg mb-5`}>
      <div className={'mb-2 text-xs tracking-wide'}>New Preview Version</div>
    </div>
  )
}

export default WorkflowScriptStatus;
