import React, { useState } from 'react'

import Icon from '../../chrome/Icon'
import { Run } from '../../qri/run'
import { Workflow } from '../../qrimatic/workflow'
import { Dataset } from "../../qri/dataset"
import ScrollTrigger from '../scroller/ScrollTrigger'
import RunStatusIcon from '../run/RunStatusIcon'
import DeployStatusIndicator from '../deploy/DeployStatusIndicator'
import WorkflowScriptStatus from './WorkflowScriptStatus'
import WorkflowCellsStatus from "./WorkflowCellsStatus"
import { useSelector } from "react-redux"
import { selectEditedCells } from "./state/workflowState"

export interface WorkflowOutlineProps {
  workflow?: Workflow
  run?: Run
  dataset: Dataset
}

const WorkflowOutline: React.FC<WorkflowOutlineProps> = ({
  workflow,
  run,
  dataset
}) => {
  const areCellsEdited = useSelector(selectEditedCells)

  const [showing, setShowing] = useState(true)
  if (!showing) {
    return (
      <div className='outline h-full w-10 flex flex-col py-4 pl-4'>
        <div className='opacity-20 cursor-pointer' onClick={() => { setShowing(!showing) }}><Icon icon='caretRight' /></div>
      </div>
    )
  }

  return (
    <div className='workflow-outline pr-7 z-20'>
      <div className='flex flex-col sticky top-20' style={{ width: 147 }}>
        <div className='text-left'>
          <div className='mb-2'>
            <ScrollTrigger target='triggers'>
              <div className='font-bold text-black mb-1 text-base'>Triggers</div>
              <div className='text-qrigray-400'>—</div>
              <div className='mb-4' />
            </ScrollTrigger>
          </div>
          <div className='mb-2'>
            <ScrollTrigger target='script'>
              <div className='font-bold text-black mb-2 text-base'>
                Script {run && <div className='float-right'>
                  <RunStatusIcon status={areCellsEdited.includes(true) ? 'waiting' : run.status} />
                </div>}
              </div>
            </ScrollTrigger>
          </div>
          <WorkflowCellsStatus run={run} dataset={dataset} />
          <div className='text-sm font-semibold mt-3 mb-1'>Next Version Preview</div>
          <WorkflowScriptStatus run={run} />

          <ScrollTrigger target='on-completion'>
            <div className='font-bold text-black mb-1 text-base text-qrigray-300'>On Completion</div>
            <div className='text-qrigray-300 text-xs mb-6'>Feature is coming soon</div>
          </ScrollTrigger>

          <hr className='mb-4' />

          <div className='mb-20'>
            <ScrollTrigger target='deploy-button'>
              {workflow && <DeployStatusIndicator workflow={workflow} />}
            </ScrollTrigger>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkflowOutline
