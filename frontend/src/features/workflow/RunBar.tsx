import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import DropdownButton, { Option } from '../../chrome/DropdownButton'
import { RunState } from '../../qrimatic/run'
import RunStateIcon from './RunStateIcon'
import { applyWorkflowTransform, saveAndApplyWorkflowTransform, setRunMode } from './state/workflowActions'
import { selectRunMode, selectWorkflow } from './state/workflowState'

export interface RunBarProps {
 status: RunState
 onRun?: () => void
}

const runModes: Option[] = [
  { id: 'apply', title: 'Dry Run', description: 'apply transform & preview results without saving'},
  { id: 'save', title: 'Run & Save', description: 'run script & save results to version history'},
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
            <RunStateIcon state={status} size='md' />
          </div>
        </div>
        <div className='flex-1 text-right'>
          <DropdownButton
            value={(runMode === 'apply') ? runModes[0] : runModes[1]}
            onClick={() => {(status === RunState.running) ? handleCancel() : handleRun() }}
            onChangeValue={(v: Option) => { 
              if (v.id === 'apply') {
                dispatch(setRunMode('apply'))
              } else if (v.id === 'save') {
                dispatch(setRunMode('save'))
              }
            }}
            options={runModes}
            />
        </div>
      </div>
    </div>
  )
}

export default RunBar
