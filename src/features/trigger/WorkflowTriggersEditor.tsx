import React from 'react'
import { useDispatch } from 'react-redux'
import { WorkflowTrigger } from '../../qrimatic/workflow'

import { showModal } from '../app/state/appActions'
import { ModalType } from '../app/state/appState'
import ScrollAnchor from '../scroller/ScrollAnchor'
import Block from '../workflow/Block'
import CronTrigger from './CronTrigger'
import ContentBox from '../../chrome/ContentBox'
import Icon from '../../chrome/Icon'
import Button from '../../chrome/Button'

export interface WorkflowTriggersEditorProps {
  triggers?: WorkflowTrigger[]
}

export interface TriggerEditorProps {
  trigger: WorkflowTrigger
  onChange: (t: WorkflowTrigger) => void
}

const WorkflowTriggersEditor: React.FC<WorkflowTriggersEditorProps> = ({
  triggers = []
}) => {
  const dispatch = useDispatch()

  const handleAddClick = () => {
    dispatch(showModal(ModalType.addTrigger))
  }

  let noTriggersWarning = ''
  if (triggers.length === 0) {
    noTriggersWarning = 'This workflow does not have any triggers defined.  Once deployed, it will only run when triggered manually.'
  }
  return (
    <ContentBox className='mb-7' paddingClassName='px-5 py-4' warning={noTriggersWarning}>
      <ScrollAnchor id='triggers'/>
      <div className='flex'>
        <div className='flex-grow'>
          <h2 className='text-2xl font-medium text-qrinavy mb-1'>Triggers</h2>
          <div className='text-sm text-qrigray-400 mb-3'>Customize your workflow to execute on a schedule, or based on other events</div>
        </div>
        {/*
          TODO(chriswhong): allow for adding other types of triggers.
          For now, we only allow one cron trigger so disable add when it exists
        */}
        {triggers.length === 0 && (
          <div className='flex items-center'>
            <Button id='workflow_triggers_add_button' onClick={handleAddClick}>
              <Icon icon='plus' size='sm'/>
            </Button>
          </div>
        )}
      </div>
      <div className='flex flex-wrap -mx-2 overflow-hidden'>
        {triggers.map((trigger: WorkflowTrigger, i) => {
          switch (trigger.type) {
            case 'cron':
              return <CronTrigger key={i} trigger={trigger} />
            default:
              return <Block {...trigger} key={i} onClick={() => { dispatch(showModal(ModalType.schedulePicker))}} />
          }
        })}
      </div>
    </ContentBox>
  )
}

export default WorkflowTriggersEditor
