import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { WorkflowTrigger, CronTrigger as CronTriggerType } from '../../qrimatic/workflow'

import { showModal } from '../app/state/appActions'
import { ModalType } from '../app/state/appState'
import Block from '../workflow/Block'
import CronTrigger from './CronTrigger'
import Link from '../../chrome/Link'

import Icon from '../../chrome/Icon'
import DropdownMenu from '../../chrome/DropdownMenu'

import IconOnlyButton from '../../chrome/IconOnlyButton'
import WorkflowCellControlButton from "../workflow/WorkflowCellControlButton"

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

  const [ showMenu, setShowMenu ] = useState(false)
  const [ createTrigger, setCreateTrigger ] = useState(false)

  const defaultCronTrigger: CronTriggerType = {
    type: 'cron',
    periodicity: 'R/2021-01-01T02:00:00.000Z/P1D'
  }

  const handleAddClick = () => {
    setShowMenu(false)
    setCreateTrigger(true)
  }

  return (
    <div className='relative'>
      <div className='flex'>
        <div className='flex-grow'>
          <h2 className='font-bold text-black mb-1'>Triggers</h2>
          <div className='text-xs text-qrigray-400 mb-3'>Customize your workflow to execute on a schedule, or based on other events</div>
        </div>
        {/*
        TODO(chriswhong): allow for adding other types of triggers.
        For now, we only allow one cron trigger so disable add when it exists
      */}
        {!createTrigger && triggers.length === 0 && (
        <div className='flex items-start'>
          <DropdownMenu
            icon={<IconOnlyButton id='workflow_triggers_add_button' size='sm' icon='plus' onClick={() => setShowMenu(true)} />}
            className=''
            menuClassName='px-3 py-4'
            openMenu={showMenu}
            onClose={() => setShowMenu(false)}
            items={[
              {
                element: <WorkflowCellControlButton id='workflow_trigger_schedule_button' onClick={handleAddClick} label={'Schedule'} icon={'calendar'}/>
              },
              {
                element: <WorkflowCellControlButton disabled={true} onClick={() => {}} label={'Webhook'} icon={'webHook'}/>

              },
              {
                element: <WorkflowCellControlButton disabled={true} onClick={() => {}} label={'Dataset'} icon={'dataset'}/>
              }
            ]}
          />
        </div>
        )}
      </div>

      {triggers.map((trigger: WorkflowTrigger, i) => {
        switch (trigger.type) {
          case 'cron':
            return <CronTrigger key={i} trigger={trigger} onCreateDelete={() => setCreateTrigger(false)} />
          default:
            return <Block {...trigger} key={i} onClick={() => { dispatch(showModal(ModalType.schedulePicker)) }} />
        }
      })}

      {triggers.length === 0 && !createTrigger && (
        <div className='relative'>
          <div className='rounded-xl absolute bg-white inline-block flex items-center justify-center' style={{
            top: -8,
            left: 10,
            height: 18,
            width: 18
          }}>
            <div className='text-warningyellow'><Icon icon='circleWarning' size='2xs' /></div>
          </div>
          <div className={'output px-3 py-2 rounded-sm border-2 rounded-lg border-warningyellow bg-white text-qrigray-400 text-xs'}>
            There are no triggers defined for this automation. The script will only run when triggered manually. <Link onClick={() => setShowMenu(true)}>Add a trigger now</Link>
          </div>
        </div>
      )}

      {createTrigger && <CronTrigger trigger={defaultCronTrigger} editMode={true} onCreateDelete={() => setCreateTrigger(false)}/>}
    </div>
  )
}

export default WorkflowTriggersEditor
