import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ReactTooltip from 'react-tooltip'

import Button from '../../chrome/Button'
import { RunStatus } from '../../qri/run'
import RunStatusIcon from '../run/RunStatusIcon'
import { applyWorkflowTransform } from './state/workflowActions'
import { deployResetRunId } from '../deploy/state/deployActions'
import {
  selectWorkflow,
  selectWorkflowDataset,
  selectApplyStatus,
  selectWorkflowIsDirty,
  selectLatestDryRunId,
  selectLatestRunId,
  selectEditedCells
} from './state/workflowState'
import { platform } from '../../utils/platform'
import DeployButton from "../deploy/DeployButton";
import { newQriRef } from "../../qri/ref";
import { useParams } from "react-router";
import { removeEvent } from "../events/state/eventsActions";
import { selectDeployRunId } from "../deploy/state/deployState";
import { selectSessionUserCanEditDataset } from '../dataset/state/datasetState'

export interface RunBarProps {
 status: RunStatus
}

const RunBar: React.FC<RunBarProps> = ({
  status
}) => {
  const dispatch = useDispatch()
  const canEdit = useSelector(selectSessionUserCanEditDataset)
  const workflow = useSelector(selectWorkflow)
  const workflowDataset = useSelector(selectWorkflowDataset)
  const applyStatus = useSelector(selectApplyStatus)
  const isDirty = useSelector(selectWorkflowIsDirty)
  const latestDryRunId = useSelector(selectLatestDryRunId)
  const latestRunId = useSelector(selectLatestRunId)
  const latestDeployRunId = useSelector(selectDeployRunId)
  const qriRef = newQriRef(useParams())
  const areCellsEdited = useSelector(selectEditedCells)

  const removeRunEvents = () => {
    if (latestDryRunId)
      dispatch(removeEvent(latestDryRunId))
    if (latestRunId)
      dispatch(removeEvent(latestRunId))
    if (latestDeployRunId)
      dispatch(removeEvent(latestDeployRunId))
  }

  const handleRun = () => {
    removeRunEvents()
    dispatch(deployResetRunId())
    dispatch(applyWorkflowTransform(workflow, workflowDataset))
  }

  const handleCancel = () => { alert('cannot cancel runs yet') }

  const isMac = (platform() === 'mac')

  const isNew = (qriRef.username === '' && qriRef.name === '') ||  (!qriRef.username && !qriRef.name)

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
                <Button type='secondary-outline' icon='circleX' className='run_bar_run_button justify-items-start mr-2' onClick={() => { handleCancel() }}>Cancel</Button>
              )
            : (
                <div data-tip data-for='dry-run'>
                  <Button type='secondary-outline' icon='playCircle' className='run_bar_run_button justify-items-start mr-2' onClick={() => { handleRun() }}>Dry Run</Button>
                </div>
              )
          }
          <DeployButton isNew={isNew} disabled={!((isNew || canEdit) && isDirty) } />
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
