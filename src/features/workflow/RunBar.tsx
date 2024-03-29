import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ReactTooltip from 'react-tooltip'

import Button from '../../chrome/Button'
import { RunStatus } from '../../qri/run'
import RunStatusIcon from '../run/RunStatusIcon'
import { applyWorkflowTransform, cancelRun } from './state/workflowActions'
import { deployResetRunId } from '../deploy/state/deployActions'
import {
  selectWorkflow,
  selectWorkflowDataset,
  selectApplyStatus,
  selectLatestDryRunId,
  selectLatestRunId,
  selectEditedCells
} from './state/workflowState'
import { platform } from '../../utils/platform'
import { removeEvent } from "../events/state/eventsActions"
import { selectDeployRunId } from "../deploy/state/deployState"
import { selectSessionUserCanEditDataset } from '../dataset/state/datasetState'
import { trackGoal } from '../../features/analytics/analytics'
import { selectIsLoggedIn } from '../session/state/sessionState'

export interface RunBarProps {
  status: RunStatus
  isNew?: boolean
}

const RunBar: React.FC<RunBarProps> = ({
  status,
  isNew = false
}) => {
  const dispatch = useDispatch()
  const canEdit = useSelector(selectSessionUserCanEditDataset)
  const workflow = useSelector(selectWorkflow)
  const workflowDataset = useSelector(selectWorkflowDataset)
  const applyStatus = useSelector(selectApplyStatus)
  const latestDryRunId = useSelector(selectLatestDryRunId)
  const latestRunId = useSelector(selectLatestRunId)
  const latestDeployRunId = useSelector(selectDeployRunId)
  const areCellsEdited = useSelector(selectEditedCells)
  const isLoggedIn = useSelector(selectIsLoggedIn)

  const removeRunEvents = () => {
    if (latestDryRunId) { dispatch(removeEvent(latestDryRunId)) }
    if (latestRunId) { dispatch(removeEvent(latestRunId)) }
    if (latestDeployRunId) { dispatch(removeEvent(latestDeployRunId)) }
  }

  const handleRun = () => {
    // workflow-click-dry-run event
    trackGoal('AN0WUIY6', 0)
    removeRunEvents()
    dispatch(deployResetRunId())
    dispatch(applyWorkflowTransform(workflow, workflowDataset, isNew))
  }

  const handleCancel = () => { dispatch(cancelRun(latestDryRunId)) }

  const isMac = (platform() === 'mac')

  let displayStatus = status
  // we already have RunStatusIcon to show the status of the run, so we
  // can use it to indicate that the /apply api call is pending OR if there was
  // an error with the call
  if (applyStatus === 'loading') { displayStatus = 'running' }
  if (applyStatus === 'error') { displayStatus = 'failed' }

  return (
    <div>
      <div className='flex items-center'>
        <div className='mr-4'>
          <div className='inline-block align-middle'>
            <RunStatusIcon status={areCellsEdited.includes(true) ? 'waiting' : displayStatus} size='md' className='ml-2' />
          </div>
        </div>
        <div className='flex'>
          {(status === "running")
            ? (
              <Button type='primary-outline' icon='circleX' className='run_bar_run_button justify-items-start mr-2' onClick={() => { handleCancel() }}>Cancel</Button>
              )
            : (
              <div data-tip data-for='dry-run'>
                <Button disabled={!((isNew && isLoggedIn) || canEdit)} type='primary-outline' icon='playCircle' className='run_bar_run_button justify-items-start mr-2' onClick={() => { handleRun() }}>Dry Run</Button>
              </div>
              )
          }
        </div>
      </div>
      <ReactTooltip
        id='dry-run'
        effect='solid'
      >
        {canEdit || (isNew && isLoggedIn)
          ? `Try this script and preview the results without saving (${isMac ? '⌘' : 'Ctrl'}+↵)`
          : 'Only the dataset owner can run this script'
        }
      </ReactTooltip>
    </div>
  )
}

export default RunBar
