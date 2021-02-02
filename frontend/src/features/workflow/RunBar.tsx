import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import DropdownButton, { Option } from '../../chrome/DropdownButton'
import { RunState } from '../../qrimatic/run'
import RunStateIcon from './RunStateIcon'
import { setRunMode } from './state/workflowActions'
import { selectRunMode } from './state/workflowState'

export interface RunBarProps {
 status: RunState,
 onRun: (mode: 'apply' | 'save') => void,
 onCancel: () => void,
}

const runModes: Option[] = [
  { id: 'apply', title: 'Dry Run', description: 'apply transform & preview results without saving'},
  { id: 'save', title: 'Run & Save', description: 'run script & save results to version history'},
]

const RunBar: React.FC<RunBarProps> = ({
  status,
  onRun,
  onCancel
}) => {
  const dispatch = useDispatch()
  const runMode = useSelector(selectRunMode)

  return (
    <div >
      <div className='flex'>
        <div className='flex-2 mr-2'>
          <div className='inline-block align-middle'>
            <RunStateIcon state={status} size='md' />
          </div>
        </div>
        <div className='flex-1 text-right'>
          <DropdownButton
            value={(runMode === 'apply') ? runModes[0] : runModes[1]}
            onClick={() => {(status === RunState.running) ? onCancel() : onRun(runMode) }}
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
