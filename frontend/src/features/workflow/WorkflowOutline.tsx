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
      <div className='p-4 text-left'>
        <div className='font-semibold text-gray-600 mb-2'>Triggers</div>
          <div className='text-xs inline-block py-1 px-2 rounded border'>
            <Icon icon='clock'/>
          </div>
          <div className='text-xs inline-block py-1 px-2 rounded border'>
            <Icon icon='projectDiagram'/>
          </div>
          <div className='text-xs inline-block py-1 px-2 rounded border'>
            <Icon icon='bolt'/>
          </div>
        <div  className='font-semibold text-gray-600 mb-2'>
          Script {(run && run.status === RunState.running) && <div className='float-right text-blue-500'> <Icon icon='spinner' spin /></div>}
        </div>
        <div className='mb-2'>
          {workflow && workflow.steps?.map((step: TransformStep, i: number) => {
            let r
            if (run) {
              r = (run?.steps && run?.steps.length >= i) ? run.steps[i] : NewRunStep({ status: RunState.waiting })
            }
            return (
              <div key={i} className='text-sm ml-2'>
                <span className='font-black text-gray-400'>{i+1}</span> &nbsp; {step.name} 
                {r && <div className='float-right text-green-500'><RunStateIcon state={r.status || RunState.waiting} /></div>}
              </div>
            )
          })}
        </div>
        <div className='font-semibold text-gray-600 mb-2'>On Completion</div>
        <div className='text-xs inline-block py-1 px-2 rounded border'>
          <Icon icon='cloudUpload'/>
        </div>
        <div className='text-xs inline-block py-1 px-2 rounded border'>
          <Icon icon='bolt'/>
        </div>
        <div className='text-xs inline-block py-1 px-2 rounded border'>
          <Icon icon='envelope'/>
        </div>
        <button
          className='mt-4 py-1 px-4 w-full font-semibold shadow-md text-white bg-gray-600 hover:bg-gray-300 rounded'
          onClick={() => { onDeploy() }}
        >
          Deploy Workflow
        </button>
      </div>
    </div>
  )
}

export default WorkflowOutline
