import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import DropdownButton, { Option } from '../../chrome/DropdownButton'
import { RunStatus } from '../../qri/run'
import RunStatusIcon from '../run/RunStatusIcon'
import { applyWorkflowTransform, saveAndApplyWorkflowTransform, setRunMode } from './state/workflowActions'
import { RunMode, selectRunMode, selectWorkflow } from './state/workflowState'

export interface RunBarProps {
 status: RunStatus
 onRun?: () => void
}

const runModes: Option<RunMode>[] = [
  { value: 'apply', title: 'Dry Run', description: 'apply transform & preview results without saving'},
  { value: 'save', title: 'Run & Save', description: 'run script & save results to version history'},
]

const RunBar: React.FC<RunBarProps> = ({
  status,
  onRun
}) => {
  const dispatch = useDispatch()
  const runMode = useSelector(selectRunMode)
  const workflow = useSelector(selectWorkflow)

  const handleRun = () => {
    if (onRun) { onRun() }
    if (runMode === 'apply') {
      dispatch(applyWorkflowTransform(workflow))
    } else if (runMode === 'save') {
      dispatch(saveAndApplyWorkflowTransform(workflow))
    }
  }

  const handleCancel = () => { alert('cannot cancel runs yet') }

  return (
    <div>
      <div className='flex'>
        <div className='flex-2 mr-2'>
          <div className='inline-block align-middle'>
            <RunStatusIcon state={status} size='md' />
          </div>
        </div>
        <div className='flex-1 text-right'>
          {(status === "running")
            ? <button className='relative rounded-md bg-gray-500 font-bold text-white p-1 pr-5 pl-5' onClick={() => { handleCancel() }}>Cancel</button>
            : <DropdownButton
                id='dry-run'
                value={(runMode === 'apply') ? runModes[0] : runModes[1]}
                onClick={() => { handleRun() }}
                onChangeValue={(opt: Option<RunMode>) => { dispatch(setRunMode(opt.value)) }}
                options={runModes}
                />
          }
        </div>
      </div>
    </div>
  )
}

export default RunBar
