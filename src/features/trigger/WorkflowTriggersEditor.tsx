import React from 'react'
import { useDispatch } from 'react-redux'
import { WorkflowTrigger } from '../../qrimatic/workflow'

import { showModal } from '../app/state/appActions'
import { ModalType } from '../app/state/appState'
import ScrollAnchor from '../scroller/ScrollAnchor'
import Block from '../workflow/Block'
import { changeWorkflowTrigger } from '../workflow/state/workflowActions'
import CronTriggerEditor from './CronTriggerEditor'
import ContentBox from '../../chrome/ContentBox'
import IconButton from '../../chrome/IconButton'

export interface WorkflowTriggersEditorProps {
  triggers?: WorkflowTrigger[]
}

export interface TriggerEditorProps {
  trigger: WorkflowTrigger
  onChange: (t: WorkflowTrigger) => void
}

// const triggerItems = [
//   {
//     name: 'Run on a Schedule',
//     description: 'Run the workflow every day at 11:30am'
//   },
//   {
//     name: 'Run when another dataset is updated',
//     description: 'The workflow will run whenever b5/world_bank_population is updated'
//   },
//   {
//     name: 'Run with a webhook',
//     description: 'The workflow will run when this webhook is called: https://qrimatic.qri.io/my-dataset'
//   },
// ]

const WorkflowTriggersEditor: React.FC<WorkflowTriggersEditorProps> = ({
  triggers = []
}) => {
  const dispatch = useDispatch()
  return (
    <ContentBox className='mb-7' paddingClassName='px-5 py-4'>
      <ScrollAnchor id='triggers'/>
      <div className='flex'>
        <div className='flex-grow'>
          <h2 className='text-2xl font-medium text-qrinavy mb-1'>Triggers</h2>
          <div className='text-sm text-qrigray-400 mb-3'>Customize your workflow to execute on a schedule, or based on other events</div>
        </div>
        <div className='flex items-center'>
          {/* TODO(chriswhong): build UI for adding triggers */}
          <IconButton icon='plus' onClick={() => {}} />
        </div>
      </div>
      <div className='flex flex-wrap -mx-2 overflow-hidden -mx-2 overflow-hidden'>
        {triggers.map((trigger: WorkflowTrigger, i) => {
          switch (trigger.type) {
            case 'cron':
              return <CronTriggerEditor key={i} trigger={trigger} onChange={(t: WorkflowTrigger) => { dispatch(changeWorkflowTrigger(i, t)) }}/>
            default:
              return <Block {...trigger} key={i} onClick={() => { dispatch(showModal(ModalType.schedulePicker))}} />
          }
        })}
      </div>
    </ContentBox>
  )
}

export default WorkflowTriggersEditor
