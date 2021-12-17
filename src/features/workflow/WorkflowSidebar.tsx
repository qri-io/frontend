import React from 'react'

import { Workflow } from '../../qrimatic/workflow'
import WorkflowTriggersEditor from '../trigger/WorkflowTriggersEditor'

interface WorkflowSidebarProps {
  workflow: Workflow
}

const WorkflowSidebar: React.FC<WorkflowSidebarProps> = ({
  workflow
}) => {
  return (
    <div className='pl-6 sticky top-24'>
      <div className='text-sm text-qrigray-400 mb-3'>AUTOMATION SETTINGS</div>
      <WorkflowTriggersEditor triggers={workflow.triggers} />
    </div>
  )
}

export default WorkflowSidebar
