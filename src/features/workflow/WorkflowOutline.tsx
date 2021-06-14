import React, { useState } from 'react'

import Icon from '../../chrome/Icon'
import { TransformStep } from '../../qri/dataset'
import { NewRunStep, Run } from '../../qri/run'
import { Workflow } from '../../qrimatic/workflow'
import ScrollTrigger from '../scroller/ScrollTrigger'
import RunStatusIcon from '../run/RunStatusIcon'
import SnackBar from '../snackBar/SnackBar'
import { RunMode } from './state/workflowState'

export interface WorkflowOutlineProps {
  runMode: RunMode
  workflow?: Workflow
  run?: Run
}

const WorkflowOutline: React.FC<WorkflowOutlineProps> = ({
  runMode,
  workflow,
  run
}) => {
  const [showing, setShowing] = useState(true)

  if (!showing) {
    return (
      <div className='outline h-full w-10 flex-none flex flex-col py-4 pl-4'>
        <div className='opacity-20 cursor-pointer' onClick={() => { setShowing(!showing) }} ><Icon icon='arrowRight' /></div>
      </div>
    ) 
  }

  return (<div className='outline h-full w-56 flex-none flex flex-col'>
    <div className='py-4 pl-4 text-left'>
      <div className='opacity-20 cursor-pointer mb-5' onClick={() => { setShowing(!showing) }} ><Icon icon='arrowLeft' /></div>
      <div className='mb-2'>
        <ScrollTrigger target='triggers'>
          <div className='font-semibold text-gray-900 mb-1 uppercase text-xs'>Triggers</div>
          <div className='text-xs text-gray-500 bg-gray-200 inline-block py-0 px-2 rounded-xl border ml-2'>
            <Icon icon='clock' size='sm' className='mr-1'/> <span>schedule</span>
          </div>
        </ScrollTrigger>
      </div>
      <div className='mb-2'>
        <ScrollTrigger target='script'>
          <div className='font-semibold text-gray-900 mb-2 uppercase text-xs tracking-wide'>
            Script {(run && run.status === "running") && <div className='float-right text-blue-500'> <Icon icon='spinner' spin /></div>}
          </div>
        </ScrollTrigger>
      </div>
      <div className='mb-2'>
        {workflow && workflow.steps?.map((step: TransformStep, i: number) => {
          let r
          if (run) {
            r = (run?.steps && run?.steps.length >= i && run.steps[i]) ? run.steps[i] : NewRunStep({ status: "waiting" })
          }
          return (
            <ScrollTrigger target={step.name} key={i}>
              <div className='text-sm ml-2 mb-1 text-gray-500 font-semibold'>
                <span className='font-black text-gray-500'>{i+1}</span> &nbsp; {step.name}
                {r && <div className='float-right text-green-500'><RunStatusIcon state={r.status || "waiting"} /></div>}
              </div>
            </ScrollTrigger>
          )
        })}
        {runMode === 'save' && <ScrollTrigger target='save'>
          <div className='text-sm ml-2 mb-1 text-gray-500 font-semibold'>
            <span className='font-black text-gray-500'>{((workflow && workflow.steps?.length) || 0)+1}</span> &nbsp; save
            {/* {r && <div className='float-right text-green-500'><RunStateIcon state={r.status || RunState.waiting} /></div>} */}
          </div>
        </ScrollTrigger>}
      </div>
      <ScrollTrigger target='on-completion'><div className='font-semibold text-gray-900 mb-2 uppercase text-xs tracking-wide'>On Completion</div></ScrollTrigger>
      <div className='text-xs text-gray-500 bg-gray-200 inline-block py-0 px-2 rounded-xl border ml-2'>
        <Icon icon='cloudUpload' size='sm' className='mr-1'/> <span>push to cloud</span>
      </div>
    </div>
    <SnackBar />
  </div>)
}

export default WorkflowOutline
