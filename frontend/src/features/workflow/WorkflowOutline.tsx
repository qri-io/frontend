import React from 'react'

import Icon from '../../chrome/Icon'
import { TransformStep } from '../../qri/dataset'
import { NewRunStep, Run, RunState } from '../../qrimatic/run'
import { Workflow } from '../../qrimatic/workflow'
import RunStateIcon from './RunStateIcon'

export interface WorkflowOutlineProps {
  workflow?: Workflow
  run?: Run
  onDeploy: () => void
}

const WorkflowOutline: React.FC<WorkflowOutlineProps> = ({ workflow, run, onDeploy }) => {
  return (
    <div className='outline h-full w-56 flex-none'>
      <div className='pt-4 pb-4 pl-4 text-left'>
        <div className='mb-2'>
          <div className='font-semibold text-gray-900 mb-1 uppercase text-xs'>Triggers</div>
          <div className='text-xs text-gray-500 bg-gray-200 inline-block py-0 px-2 rounded-xl border ml-2'>
            <Icon icon='clock' size='sm' className='mr-1'/> <span>schedule</span>
          </div>
        </div>
        <div  className='font-semibold text-gray-900 mb-2 uppercase text-xs tracking-wide'>
          Script {(run && run.status === RunState.running) && <div className='float-right text-blue-500'> <Icon icon='spinner' spin /></div>}
        </div>
        <div className='mb-2'>
          {workflow && workflow.steps?.map((step: TransformStep, i: number) => {
            let r
            if (run) {
              r = (run?.steps && run?.steps.length >= i && run.steps[i]) ? run.steps[i] : NewRunStep({ status: RunState.waiting })
            }
            return (
              <div key={i} className='text-sm ml-2 mb-1 text-gray-500 font-semibold'>
                <span className='font-black text-gray-500'>{i+1}</span> &nbsp; {step.name}
                {r && <div className='float-right text-green-500'><RunStateIcon state={r.status || RunState.waiting} /></div>}
              </div>
            )
          })}
        </div>
        <div className='font-semibold text-gray-900 mb-2 uppercase text-xs tracking-wide'>On Completion</div>
        <div className='text-xs text-gray-500 bg-gray-200 inline-block py-0 px-2 rounded-xl border ml-2'>
          <Icon icon='cloudUpload' size='sm' className='mr-1'/> <span>push to cloud</span>
        </div>
        <button
          className='mt-4 py-1 px-4 w-full font-semibold shadow-md text-white bg-qrilightblue hover:bg-qrilightblue-light rounded'
          onClick={() => { onDeploy() }}
        >
          Deploy Workflow
        </button>
      </div>
    </div>
  )
}

export default WorkflowOutline
