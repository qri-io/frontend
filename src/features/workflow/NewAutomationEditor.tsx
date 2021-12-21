// fires actions to load a template and prepare state for creating a new automation
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Head from '../app/Head'
import { QriRef } from '../../qri/ref'
import { NewDataset } from '../../qri/dataset'
import WorkflowPage from './WorkflowPage'
import { selectTemplate } from '../template/templates'
import { resetDatasetState } from "../dataset/state/datasetActions"
import { showModal } from '../app/state/appActions'
import { ModalType } from '../app/state/appState'
import { selectSessionUser } from "../session/state/sessionState"

import {
  setTemplate,
  resetWorkflowState
} from './state/workflowActions'

interface ExistingAutomationEditorProps {
  qriRef: QriRef
}

export const DEFAULT_AUTOMATED_DATASET_NAME = 'untitled-automated-dataset'

const ExistingAutomationEditor: React.FC<ExistingAutomationEditorProps> = ({ qriRef }) => {
  const dispatch = useDispatch()
  const user = useSelector(selectSessionUser)
  useEffect(() => {
    dispatch(resetWorkflowState())
    dispatch(resetDatasetState())

    const template = selectTemplate('CSVDownload')
    dispatch(setTemplate(NewDataset({
      ...template,
      username: user.username,
      name: DEFAULT_AUTOMATED_DATASET_NAME
    })))
    dispatch(showModal(ModalType.automationSplash))
  }, [])

  return (
    <>
      <Head data={{
        title: `${qriRef.username}/${qriRef.name} workflow editor | Qri`,
        appView: true
      }}/>
      <WorkflowPage qriRef={qriRef} isNew commitTitle='created automated dataset' />
    </>
  )
}
export default ExistingAutomationEditor
