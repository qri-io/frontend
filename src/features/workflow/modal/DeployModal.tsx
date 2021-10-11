import React, { useState, useEffect } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import ReactCanvasConfetti from 'react-canvas-confetti'
import classNames from 'classnames'

import Button from '../../../chrome/Button'
import Icon from '../../../chrome/Icon'
import { clearModal, setModalLocked } from '../../app/state/appActions'
import IconButton from '../../../chrome/IconButton'
import TextInput from '../../../chrome/forms/TextInput'
import Checkbox from '../../../chrome/forms/Checkbox'
import { deployWorkflow } from '../../deploy/state/deployActions'
import {workflowResetDryRunId, setWorkflowRef, workflowResetEditedClearedCells} from '../state/workflowActions'
import {
  selectWorkflow,
  selectWorkflowQriRef,
  selectWorkflowDataset,
  selectLatestDryRunId,
  selectLatestRunId
} from '../state/workflowState'
import { validateDatasetName } from '../../session/state/formValidation'
import RunStatusIcon from '../../run/RunStatusIcon'
import { selectDeployRunId, selectDeployStatus } from '../../deploy/state/deployState'
import { selectSessionUser } from '../../session/state/sessionState'
import WarningDialog from '../WarningDialog'
import { removeEvent } from "../../events/state/eventsActions";
import { useDebounce } from "use-debounce";

const DEBOUNCE_TIMER = 500

const DeployModal: React.FC = () => {
  const dispatch = useDispatch()
  const latestDryRunId = useSelector(selectLatestDryRunId)
  const latestRunId = useSelector(selectLatestRunId)
  const latestDeployId = useSelector(selectDeployRunId)
  const history = useHistory()

  const qriRef = useSelector(selectWorkflowQriRef)
  const workflow = useSelector(selectWorkflow)
  const dataset = useSelector(selectWorkflowDataset)
  const deployStatus = useSelector(selectDeployStatus(qriRef))
  const { username } = useSelector(selectSessionUser)

  // determine if the workflow is new by reading /new at the end of the pathname
  const segments = useLocation().pathname.split('/')
  const isNew = segments[2] === 'new'

  // local state
  const [ dsName, setDsName ] = useState('')
  const [debouncedDsName] = useDebounce(dsName, DEBOUNCE_TIMER)
  const [ dsNameError, setDsNameError ] = useState<string | null>(null)
  const [ runNow, setRunNow ] = useState(false)
  const [ canBeDeployed, setCanBeDeployed ] = useState(!isNew);
  const [ deploying, setDeploying ] = useState(false)

  useEffect(() => {
    // when user edits dataset name, make sure it gets written to the workflow's qriref
    if (isNew) {
      dispatch(setWorkflowRef({
        username,
        name: dsName
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ dsName, dispatch, username ])

  // listen for deployStatus changes
  useEffect(() => {
    // the moment of triumph!
    if (deployStatus === 'deployed') {
      dispatch(setModalLocked(false))
      // navigate to the new dataset's workflow!
      history.push({
        pathname: `/${qriRef.username}/${qriRef.name}/workflow`,
      })
    }

    if (deployStatus === 'failed') {
      dispatch(setModalLocked(false))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ deployStatus ])


  const handleClose = () => {
    dispatch(clearModal())
  }

  const handleDsNameChange = (value: string) => {
    setDsName(value)
  }

  useEffect(() => {
    if (isNew) {
      setCanBeDeployed(false)
    }
  }, [ dsName, isNew ])

  const handleDeployClick = () => {
    setDeploying(true)
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
  }

  useEffect(() => {
    if (isNew) {
      //validate the dataset name
      const err = validateDatasetName(debouncedDsName)
      setDsNameError(err)
      setCanBeDeployed(debouncedDsName.length > 0 && err === null)
    }
  }, [ debouncedDsName, isNew ])


  let heading = 'You\'re almost there!'
  let subHeading = 'We need one more thing before you can deploy'

  let content = (
    <div className='text-sm mb-4'>
      <div className='text-black font-semibold mb-1'>Dataset name *</div>
      <div className='text-qrigray-400 mb-2'>Give your dataset a descriptive, machine-friendly name</div>
      <TextInput
        name='dsName'
        value={dsName}
        onChange={handleDsNameChange}
        error={dsNameError}
      />
    </div>
  )

  // if not new, we don't need to ask for a rename
  if (!isNew) {
    heading = 'Ready to Deploy!'
    subHeading = 'Confirm your settings and mash that deploy button'
    content = <></>
  }


  let deployingContent = (
    <>
      <RunStatusIcon status={'running'} size='lg' className='text-black mb-2' />
      <div className='font-semibold text-xl mb-2'>Deploying Workflow</div>
      <div className='text-sm text-qrigray'>Standby... this won't take long.</div>
    </>
  )

  if (deployStatus === 'deployed') {
    deployingContent = (
      <>
        <RunStatusIcon status={'succeeded'} size='lg' className='text-green mb-2' />
        <div id='snack_bar_message_workflow_deployed' className='font-semibold text-xl mb-2'>Workflow Deployed</div>
        <div className='text-sm text-qrigray'>You're all set! Sit back and let the data flow.</div>
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
  }

  const showButton = ['deployed', 'failed'].includes(deployStatus)
  let buttonText = 'Done'
  let buttonType = 'primary'

  if (deployStatus === 'failed') {
    buttonText = 'Close'
    buttonType = 'light'
  }

  return (
    <div style={{ width: 440, height: 510 }}>
      <div className={classNames('absolute w-full h-full bg-white p-8 transition-all duration-300 bg-white p-8 text-left text-black flex flex-col z-10', {
        'left-0': !deploying,
        '-left-full': deploying
      })}>
        <div className='flex'>
          <div className='flex-grow text-3xl font-black mb-6'>{heading}</div>
          <IconButton icon='close' className='ml-10' onClick={handleClose}/>
        </div>
        <div className='mb-6 flex-grow'>
          <div className='mb-3'>{subHeading}</div>

          {content}
          {/* TODO(chriswhong): add other predeployment checks like triggers and completion tasks */}
          <Checkbox label='Run on Deploy' value={runNow} onChange={() => { setRunNow(!runNow) }} />
        </div>
        <Button
          id='deploy_modal_deploy_button'
          size='sm'
          type='secondary'
          className='w-full mt-2 flex-shrink-0'
          onClick={handleDeployClick}
          submit
          disabled={!canBeDeployed}>
          <Icon icon='rocket' className='mr-2' /> Deploy
        </Button>
        {workflow.triggers?.length === 0 && (
          <WarningDialog text='This workflow does not have any triggers defined.  Once deployed, it will only run when triggered manually.'/>
        )}
      </div>

      <div className='flex flex-col h-full w-full p-8'>
        <div className='flex-grow flex items-center mx-auto'>
          <div className='text-center'>
            {deployingContent}
          </div>
        </div>
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
        <Button id='deploy_modal_done_button' size='sm' type={buttonType} className={classNames('w-full mt-2', {
          'invisible': !showButton
        })} onClick={handleClose} submit>
          {buttonText}
        </Button>
      </div>
    </div>
  )
}

export default DeployModal
