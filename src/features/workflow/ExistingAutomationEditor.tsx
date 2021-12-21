import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Head from '../app/Head'
import { QriRef } from '../../qri/ref'
import { NewDataset, isDatasetEmpty } from '../../qri/dataset'
import WorkflowPage from './WorkflowPage'
import { selectTemplate } from '../template/templates'
import { selectDataset } from '../dataset/state/datasetState'
import { showModal } from '../app/state/appActions'
import { ModalType } from '../app/state/appState'

import {
  setTemplate,
  setWorkflowDataset
} from './state/workflowActions'

interface ExistingAutomationEditorProps {
  qriRef: QriRef
}

const ExistingAutomationEditor: React.FC<ExistingAutomationEditorProps> = ({ qriRef }) => {
  const dispatch = useDispatch()
  const activeDataset = useSelector(selectDataset)

  useEffect(() => {
    // once we have a non-empty active dataset, check whether it has a transform
    // if so we assign it to workflow.dataset, if not we add template code and show the splash modal
    if (!isDatasetEmpty(activeDataset)) {
      if (activeDataset.transform) {
        dispatch(setWorkflowDataset(activeDataset))
      } else {
        const template = selectTemplate('CSVDownload')

        dispatch(setTemplate(NewDataset({
          ...activeDataset,
          transform: template.transform
        })))
        dispatch(showModal(ModalType.automationSplash, {
          title: 'Let\'s Automate Your Dataset!'
        }))
      }
    }
  }, [activeDataset])

  const commitTitle = activeDataset.transform ? 'updated automation script' : 'added automation script'

  return (
    <>
      <Head data={{
        title: `${qriRef.username}/${qriRef.name} Automation | Qri`,
        appView: true
      }}/>
      <WorkflowPage qriRef={qriRef} commitTitle={commitTitle} />
    </>
  )
}
export default ExistingAutomationEditor
