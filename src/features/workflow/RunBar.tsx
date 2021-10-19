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
import Icon from "../../chrome/Icon";
import DeployButton from "../deploy/DeployButton";
import { newQriRef } from "../../qri/ref";
import { useParams } from "react-router";
import { removeEvent } from "../events/state/eventsActions";
import { selectDeployRunId } from "../deploy/state/deployState";

export interface RunBarProps {
 status: RunStatus
}

const RunBar: React.FC<RunBarProps> = ({
  status
}) => {
  const dispatch = useDispatch()
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
      <div className='flex w-64 items-center'>
        <div className='mr-4'>
          <div className='inline-block align-middle'>
            <RunStatusIcon status={areCellsEdited.includes(true) ? 'waiting' : displayStatus} size='md' className='ml-2' />
          </div>
        </div>
        <div className='w-36'>
          {(status === "running")
            ? <div className='flex'>
                <Button type='secondary-outline' className='px-2 w-24 run_bar_run_button justify-items-start mr-2' onClick={() => { handleCancel() }}>
                  <Icon className='mr-1.5' icon='playCircle' size='sm'/>Cancel</Button>
                <DeployButton isNew={isNew} disabled={!isDirty} />
              </div>
            : (
              <div className='flex'>
                <div data-tip data-for='dry-run'>
                  <Button type='secondary-outline' className='px-2 w-24 run_bar_run_button justify-items-start mr-2' onClick={() => { handleRun() }}>
                    <Icon className='mr-1.5' icon='playCircle' size='sm'/>Dry Run</Button>
                </div>
                <div>
                  <DeployButton isNew={isNew} disabled={!isDirty} />
                </div>
              </div>
            )
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
