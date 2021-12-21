import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Prompt, Redirect } from 'react-router'
import classNames from 'classnames'
import { useInView } from 'react-intersection-observer'
import { Location } from 'history'

import Spinner from '../../chrome/Spinner'
import { QriRef } from '../../qri/ref'
import WorkflowEditor from './WorkflowEditor'
import RunBar from './RunBar'
import { qriRefFromDataset } from "../../qri/dataset"
import EditorLayout from '../layouts/EditorLayout'
import { selectRun } from "../events/state/eventsState"
import DatasetHeaderLayout from "../dataset/DatasetHeaderLayout"
import DatasetMiniHeader from '../dataset/DatasetMiniHeader'
import { newVersionInfoFromDataset } from "../../qri/versionInfo"
import { showModal } from '../app/state/appActions'
import { ModalType } from '../app/state/appState'

import { DEFAULT_AUTOMATED_DATASET_NAME } from './NewAutomationEditor'

import {
  setWorkflowRef,
  workflowUndoChanges,
  setWorkflowDatasetName,
  setWorkflowDatasetTitle
} from './state/workflowActions'

import {
  selectWorkflow,
  selectWorkflowIsDirty,
  selectWorkflowDataset,
  selectLatestDeployOrDryRunId
} from './state/workflowState'

interface WorkflowPageProps {
  qriRef: QriRef
  isNew?: boolean
  commitTitle?: string
}

const WorkflowPage: React.FC<WorkflowPageProps> = ({
  qriRef,
  isNew = false,
  commitTitle = ''
}) => {
  const dispatch = useDispatch()

  const [ runNow, setRunNow ] = useState(isNew)

  let dataset = useSelector(selectWorkflowDataset)
  const latestDryRunDeployId = useSelector(selectLatestDeployOrDryRunId)
  const latestRun = useSelector(selectRun(latestDryRunDeployId))
  const isDirty = useSelector(selectWorkflowIsDirty)
  const workflow = useSelector(selectWorkflow)

  const [redirectTo, setRedirectTo] = useState('')

  useEffect(() => {
    // ensures that workflowDataset username and name match the route
    dispatch(setWorkflowRef(qriRef))
  }, [])

  const { ref: stickyHeaderTriggerRef, inView } = useInView({
    threshold: 0.6,
    initialInView: true
  })

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

  const headerChildren = <RunBar status={latestRun ? latestRun.status : "waiting" } isNew />

  let commitBarContent = <>Save script changes</>

  let commitDisabled = false

  let nameUnchanged = dataset.name === DEFAULT_AUTOMATED_DATASET_NAME

  if (isNew) {
    commitBarContent = <>Committing will create your new dataset and run this script</>

    if (nameUnchanged) {
      commitDisabled = true
      commitBarContent = <>Enter a machine-friendly descriptive name to proceed</>
    }
  }

  const handleCommit = () => {
    dispatch(showModal(ModalType.automationCommit, {
      username: dataset.username,
      name: dataset.name,
      runNow,
      isNew
    }))
  }

  return (
    <EditorLayout
      commitBarContent={commitBarContent}
      commitLoading={false}
      commitTitle={commitTitle}
      onCommitTitleChange={() => {}}
      onCommit={handleCommit}
      commitDisabled={commitDisabled}
      showCommitBar
      showRunNow={!isNew}
      runNow={runNow}
      onRunNowChange={() => { setRunNow(!runNow) }}
      scroll
    >
      <Prompt
        when
        message={handleBlockedNavigation}
      />
      <DatasetMiniHeader
        qriRef={qriRefFromDataset(dataset)}
        header={newVersionInfoFromDataset(dataset)}
        show={!inView}
      >
        {headerChildren}
      </DatasetMiniHeader>
      <div className={classNames('dataset_fixed_layout p-6 w-full')}>
        <div ref={stickyHeaderTriggerRef}>
          <DatasetHeaderLayout
            qriRef={qriRefFromDataset(dataset)}
            header={newVersionInfoFromDataset(dataset)}
            nameEditable={isNew}
            onNameChange={(_, d: string) => { dispatch(setWorkflowDatasetName(d)) }}
            titleEditable={isNew}
            onTitleChange={(_, d: string) => { dispatch(setWorkflowDatasetTitle(d)) }}
            showInputOutlines={isNew}
          >
            {headerChildren}
          </DatasetHeaderLayout>
        </div>
        <div className='flex flex-grow'>
          {dataset || isNew
            ? (
              <WorkflowEditor
                qriRef={qriRef}
                workflow={workflow}
              />
              )
            : (<div className='w-full h-full p-4 flex justify-center items-center'>
              <Spinner color='#43B3B2' />
            </div>)}
        </div>
      </div>
      {redirectTo && <Redirect to={redirectTo} />}
    </EditorLayout>
  )
}

export default WorkflowPage
