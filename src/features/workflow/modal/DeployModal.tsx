import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import ReactCanvasConfetti from 'react-canvas-confetti'
import classNames from 'classnames'

import Button from '../../../chrome/Button'
import { clearModal, setModalLocked } from '../../app/state/appActions'

import { deployWorkflow } from '../../deploy/state/deployActions'
import { workflowResetDryRunId, workflowResetEditedClearedCells } from '../state/workflowActions'
import {
  selectWorkflow,
  selectWorkflowQriRef,
  selectWorkflowDataset,
  selectLatestDryRunId,
  selectLatestRunId
} from '../state/workflowState'
import RunStatusIcon from '../../run/RunStatusIcon'
import { selectDeployRunId, selectDeployStatus } from '../../deploy/state/deployState'
import { removeEvent } from "../../events/state/eventsActions"

export interface DeployModalProps {
  username: string
  name: string
  runNow: boolean
  isNew: boolean
}

const DeployModal: React.FC<DeployModalProps> = ({
  username,
  name,
  runNow,
  isNew
}) => {
  const dispatch = useDispatch()
  const latestDryRunId = useSelector(selectLatestDryRunId)
  const latestRunId = useSelector(selectLatestRunId)
  const latestDeployId = useSelector(selectDeployRunId)
  const history = useHistory()

  const qriRef = useSelector(selectWorkflowQriRef)
  const workflow = useSelector(selectWorkflow)
  const dataset = useSelector(selectWorkflowDataset)
  const deployStatus = useSelector(selectDeployStatus(qriRef))

  // listen for deployStatus changes
  useEffect(() => {
    // the moment of triumph!
    if (deployStatus === 'deployed') {
      dispatch(setModalLocked(true))
      // navigate to the new dataset's workflow!
      history.push({
        pathname: `/${qriRef.username}/${qriRef.name}/automation`
      })
    }

    if (deployStatus === 'failed') {
      dispatch(setModalLocked(false))
    }
  }, [ deployStatus ])

  const handleClose = () => {
    dispatch(clearModal())
  }

  useEffect(() => {
    dispatch(workflowResetEditedClearedCells())
    dispatch(workflowResetDryRunId())
    if (latestDryRunId) {
      dispatch(removeEvent(latestDryRunId))
    }
    if (latestRunId) {
      dispatch(removeEvent(latestRunId))
    }
    if (latestDeployId) {
      dispatch(removeEvent(latestDeployId))
    }
    dispatch(setModalLocked(true))

    dispatch(deployWorkflow(qriRef, workflow, dataset, runNow))
  }, [])

  let deployingContent = (
    <>
      <RunStatusIcon status={'running'} size='lg' className='text-black mb-2' />
      <div className='font-semibold text-xl mb-2'>Committing Changes</div>
      <div className='text-sm text-qrigray'>Standby... this won&apos;t take long.</div>
    </>
  )

  const handleGoToPreviewClick = () => {
    dispatch(clearModal())
    history.push(`/${username}/${name}`)
  }

  const handleGoToEditorClick = () => {
    dispatch(clearModal())
    history.push(`/${username}/${name}/edit#meta`)
  }

  let buttonContent

  let successText = 'Changes committed!'
  let successSubtext = 'You\'re all set! Sit back and let the data flow.'

  if (isNew) {
    successText = 'Dataset Created!'
    successSubtext = 'Add some metadata or a readme to improve your Dataset'
  }

  if (deployStatus === 'deployed') {
    deployingContent = (
      <>
        <RunStatusIcon status={'succeeded'} size='lg' className='text-green mb-2' />
        <div id='snack_bar_message_workflow_deployed' className='font-semibold text-xl mb-2'>{successText}</div>
        <div className='text-sm text-qrigray'>{successSubtext}</div>
      </>
    )

    buttonContent = (
      <>
        <Button type='primary-outline' className='mr-5' onClick={handleGoToEditorClick} block>
          Edit Metadata
        </Button>
        <Button onClick={handleGoToPreviewClick} block>
          Go to Preview
        </Button>
      </>
    )
  }

  if (deployStatus === 'failed') {
    deployingContent = (
      <>
        <RunStatusIcon status={'failed'} size='lg' className='text-green mb-2' />
        <div className='font-semibold text-xl mb-2'>Deploy Failed</div>
        <div className='text-sm text-qrigray'>Sorry, something went wrong...</div>
      </>
    )
    buttonContent = (
      <Button id='deploy_modal_done_button' type='light' block className={classNames('mt-2')} onClick={handleClose} submit>
        Close
      </Button>
    )
  }

  return (
    <div style={{ width: 440, height: 510 }}>
      <div className='flex flex-col h-full w-full p-8'>
        <div className='flex-grow flex items-center mx-auto'>
          <div className='text-center'>
            {deployingContent}
          </div>
        </div>
        {
          isNew && (
            <ReactCanvasConfetti
              // set the styles as for a usual react component
              style={{
                position: 'fixed',
                width: '100%',
                height: '100%',
                zIndex: -1
              }}
              fire={deployStatus === 'deployed'}
            />
          )
        }
        <div className={classNames('flex', {
          'hidden': !buttonContent
        })}>
          {buttonContent}
        </div>
      </div>
    </div>
  )
}

export default DeployModal
