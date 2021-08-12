import React, { useEffect, useState } from 'react'
import { Prompt, Redirect } from 'react-router'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Location } from 'history'

import WorkflowOutline from './WorkflowOutline'
import {
  selectLatestRun,
  selectRunMode,
  selectWorkflow,
  selectWorkflowIsDirty,
  selectWorkflowDataset
} from './state/workflowState'

import { setTemplate } from './state/workflowActions'
import { selectTemplate } from '../template/templates'
import { QriRef } from '../../qri/ref'
import WorkflowEditor from './WorkflowEditor'
import { showModal } from '../app/state/appActions'
import { ModalType } from '../app/state/appState'

interface WorkflowLocationState {
  template: string
  showSplashModal?: boolean
}

export interface WorkflowProps {
  qriRef: QriRef
}

const Workflow: React.FC<WorkflowProps> = ({ qriRef }) => {
  const dispatch = useDispatch()
  const location = useLocation<WorkflowLocationState>()
  const workflow = useSelector(selectWorkflow)
  const workflowDataset = useSelector(selectWorkflowDataset)
  const latestRun = useSelector(selectLatestRun)
  const runMode = useSelector(selectRunMode)
  const isDirty = useSelector(selectWorkflowIsDirty)

  const [ redirectTo, setRedirectTo ] = useState('')

  useEffect(() => {
    if (location.state?.template) {
      const template = selectTemplate(location.state.template)
      dispatch(setTemplate(template))
    }

    if (location.state?.showSplashModal) {
      dispatch(showModal(ModalType.workflowSplash))
    }
  }, [dispatch, location.state])

  const isNew = qriRef.username === '' && qriRef.name === ''

  const handleBlockedNavigation = (nextLocation: Location ) => {
    if (redirectTo) { return true }
    // do nothing if user clicks the link for the active route
    if (nextLocation.pathname === location.pathname) {
      return true
    }

    if (isDirty) {
      dispatch(showModal(ModalType.unsavedChanges, {
        action: () => {
          setRedirectTo(nextLocation.pathname)
        }
      }))
      return false
    }
    return true
  }

  return (
    <>
      <div id='workflow' className='w-full flex'>
        <Prompt
          when={true}
          message={handleBlockedNavigation}
        />
        <WorkflowOutline workflow={workflow} dataset={workflowDataset} run={latestRun} runMode={runMode} />
        <WorkflowEditor qriRef={qriRef} workflow={workflow} dataset={workflowDataset} run={latestRun} runMode={runMode} isDirty={isDirty} />
        { redirectTo && <Redirect to={redirectTo} /> }
      </div>
    </>
  )
}

export default Workflow;
