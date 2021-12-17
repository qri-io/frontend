import React from 'react'

import Head from '../app/Head'
import { QriRef } from '../../qri/ref'
import WorkflowPage from './WorkflowPage'
interface ExistingAutomationEditorProps {
  qriRef: QriRef
}

const ExistingAutomationEditor: React.FC<ExistingAutomationEditorProps> = ({ qriRef }) => {
  return (
    <>
      <Head data={{
        title: `${qriRef.username}/${qriRef.name} Automation | Qri`,
        appView: true
      }}/>
      <WorkflowPage qriRef={qriRef} />
    </>
  )
}
export default ExistingAutomationEditor
