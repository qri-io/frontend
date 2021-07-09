import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ReactTooltip from 'react-tooltip'

import Button from '../../chrome/Button'
import { RunStatus } from '../../qri/run'
import RunStatusIcon from '../run/RunStatusIcon'
import { applyWorkflowTransform, deployWorkflow } from './state/workflowActions'
import { selectRunMode, selectWorkflow } from './state/workflowState'
import { platform } from '../../utils/platform'

export interface RunBarProps {
 status: RunStatus
 onRun?: () => void
}

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
    }
    else if (runMode === 'save') {
      dispatch(deployWorkflow(workflow))
    }
  }

  const handleCancel = () => { alert('cannot cancel runs yet') }

  const isMac = (platform() === 'mac')

  return (
    <div>
      <div className='flex w-36 items-center'>
        <div className='mr-4'>
          <div className='inline-block align-middle'>
            <RunStatusIcon status={status} size='md' className='ml-2' />
          </div>
        </div>
        <div className='w-36'>
          {(status === "running")
            ? <Button className='w-24' onClick={() => { handleCancel() }}>Cancel</Button>
            : <div data-tip data-for='dry-run'><Button className='w-24' onClick={() => { handleRun() }}>Dry Run</Button></div>
          }
        </div>
      </div>
      <ReactTooltip
        id='dry-run'
        effect='solid'
      >
        Try this script and preview the results without saving ({isMac ? '⌘' : 'Ctrl'}+↵)
      </ReactTooltip>
    </div>
  )
}

export default RunBar
