import React, { useEffect, useState } from 'react'
import { Prompt, Redirect } from 'react-router'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Location } from 'history'

import WorkflowOutline from './WorkflowOutline'
import {
  selectWorkflow,
  selectWorkflowIsDirty,
  selectWorkflowDataset,
  selectLatestDeployOrDryRunId
} from './state/workflowState'

import { setTemplate, resetWorkflowState, workflowUndoChanges } from './state/workflowActions'
import { selectTemplate } from '../template/templates'
import { QriRef } from '../../qri/ref'
import WorkflowEditor from './WorkflowEditor'
import { showModal } from '../app/state/appActions'
import { ModalType } from '../app/state/appState'
import { selectRun } from "../events/state/eventsState"
import { resetDatasetState } from "../dataset/state/datasetActions"

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
  const latestDryRunDeployID = useSelector(selectLatestDeployOrDryRunId)
  const latestRun = useSelector(selectRun(latestDryRunDeployID))
  const isDirty = useSelector(selectWorkflowIsDirty)

  const [redirectTo, setRedirectTo] = useState('')

  useEffect(() => {
    if (location.pathname === '/workflow/new') {
      dispatch(resetWorkflowState())
      dispatch(resetDatasetState())
    }

    if (location.state?.template) {
      const template = selectTemplate(location.state.template)
      // @ts-expect-error
      dispatch(setTemplate(template))
    }

    if (location.state?.showSplashModal) {
      dispatch(showModal(ModalType.workflowSplash))
    }
  }, [])

  const handleBlockedNavigation = (nextLocation: Location) => {
    if (redirectTo) { return true }
    // do nothing if user clicks the link for the active route
    if (nextLocation.pathname === location.pathname) {
      return true
    }

    if (isDirty) {
      dispatch(showModal(ModalType.unsavedChanges, {
        action: () => {
          dispatch(workflowUndoChanges())
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
          when
          message={handleBlockedNavigation}
        />
        <WorkflowOutline workflow={workflow} run={latestRun} dataset={workflowDataset} />
        <WorkflowEditor qriRef={qriRef} workflow={workflow} dataset={workflowDataset} run={latestRun} />
        {redirectTo && <Redirect to={redirectTo} />}
      </div>
    </>
  )
}

export default Workflow
