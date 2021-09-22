import React, { useState } from 'react'

import Icon from '../../chrome/Icon'
import { Run } from '../../qri/run'
import { Workflow } from '../../qrimatic/workflow'
import ScrollTrigger from '../scroller/ScrollTrigger'
import RunStatusIcon from '../run/RunStatusIcon'
import DeployStatusIndicator from '../deploy/DeployStatusIndicator'
import WorkflowScriptStatus from './WorkflowScriptStatus'

export interface WorkflowOutlineProps {
  workflow?: Workflow
  run?: Run
}

const WorkflowOutline: React.FC<WorkflowOutlineProps> = ({
  workflow,
  run
}) => {
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
      <div className='w-44 flex flex-col sticky top-20'>
        <div className='text-left'>
          <div className='text-qrigray-400 text-xs font-medium mb-4'>AUTOMATION OUTLINE</div>
          <div className='mb-2'>
            <ScrollTrigger target='triggers'>
              <div className='font-semibold text-black mb-1'>Triggers</div>
              <div className='text-qrigray-400'>—</div>
              <div className='mb-4' />
            </ScrollTrigger>
          </div>
          <div className='mb-2'>
            <ScrollTrigger target='script'>
              <div className='font-semibold text-black mb-2'>
                Script {(run && run.status === 'running') && <div className='float-right'><RunStatusIcon status='running' /></div>}
              </div>
            </ScrollTrigger>
          </div>
          <WorkflowScriptStatus run={run} />

          <ScrollTrigger target='on-completion'>
            <div className='font-semibold text-black mb-1'>On Completion</div>
            <div className='text-qrigray-400'>—</div>
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
