import React from 'react'
import { useDispatch } from 'react-redux';
import { WorkflowTrigger } from '../../qrimatic/workflow';

import { showModal } from '../app/state/appActions';
import { ModalType } from '../app/state/appState';
import ScrollAnchor from '../scroller/ScrollAnchor';
import Block from '../workflow/Block';
import { changeWorkflowTrigger } from '../workflow/state/workflowActions';
import CronTriggerEditor from './CronTriggerEditor';

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
  const dispatch = useDispatch();
  return (
    <section className='p-4 bg-white shadow-sm mb-4'>
        <ScrollAnchor id='triggers'/>
        <h2 className='text-2xl font-semibold text-gray-600 mb-1'>Triggers</h2>
        <div className='text-xs mb-3'>Customize your workflow to execute on a schedule, or based on other events</div>
        <div className='grid grid-flow-col grid-cols-3 -mx-2 overflow-hidden'>
          {triggers.map((trigger: WorkflowTrigger, i) => {
            switch (trigger.type) {
              case 'cron':
                return <CronTriggerEditor key={i} trigger={trigger} onChange={(t: WorkflowTrigger) => { dispatch(changeWorkflowTrigger(i, t)) }}/>
              default:
                return <Block {...trigger} key={i} onClick={() => { dispatch(showModal(ModalType.schedulePicker))}} />
            }
          })}
        </div>
      </section>
    )
}

export default WorkflowTriggersEditor;
