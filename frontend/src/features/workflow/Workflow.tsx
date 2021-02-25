import React, { useEffect, useState } from 'react'
import { Prompt, Redirect } from 'react-router'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Location } from 'history'

import WorkflowOutline from './WorkflowOutline'
import { selectLatestRun, selectRunMode, selectWorkflow } from './state/workflowState'
import { loadWorkflowByDatasetRef, setWorkflow, setWorkflowRef } from './state/workflowActions'
import { selectTemplate } from '../template/templates'
import { QriRef } from '../../qri/ref'
import WorkflowEditor from './WorkflowEditor'
import { showModal } from '../app/state/appActions'
import { ModalType } from '../app/state/appState'

interface WorkflowLocationState {
  template: string
}

export interface WorkflowProps {
  qriRef: QriRef
}

const Workflow: React.FC<WorkflowProps> = ({ qriRef }) => {
  const dispatch = useDispatch()
  const location = useLocation<WorkflowLocationState>()
  const workflow = useSelector(selectWorkflow)
  const latestRun = useSelector(selectLatestRun)
  const runMode = useSelector(selectRunMode)

  const [ shouldPrompt, setShouldPrompt ] = useState(true)
  const [ redirectTo, setRedirectTo ] = useState('')

  useEffect(() => {
    if (location.state && location.state.template) {
      dispatch(setWorkflow(selectTemplate(location.state.template)))
    }
  }, [dispatch, location.state])

  useEffect(() => {
    // TODO (b5) - highly-unlikely but possible race condition here. loading workflow
    // should be chained in a promise
    dispatch(setWorkflowRef(qriRef))
    dispatch(loadWorkflowByDatasetRef(qriRef))
  }, [dispatch, qriRef])

  const handleBlockedNavigation = (nextLocation: Location ) => {
    // TODO(chriswhong): actually use app state to determine if navigation should be blocked

    // do nothing if user clicks the link for the active route
    if (nextLocation.pathname === location.pathname) {
      return true
    }

    if (shouldPrompt) {
      setRedirectTo(nextLocation.pathname)
      dispatch(showModal(ModalType.unsavedChanges, {
        action: () => { setShouldPrompt(false)}
      }))
      return false
    }
    return true
  }

  return (
    <>
      <div id='workflow' className='flex h-full'>
        <Prompt
          when={true}
          message={handleBlockedNavigation}
        />
        <WorkflowOutline workflow={workflow} run={latestRun} runMode={runMode} />
        <WorkflowEditor workflow={workflow} run={latestRun} runMode={runMode} />
        { !shouldPrompt && redirectTo && <Redirect to={redirectTo} /> }
      </div>
    </>
  )
}

export default Workflow;
