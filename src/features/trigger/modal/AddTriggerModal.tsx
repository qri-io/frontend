import React, { useState } from 'react'
import classNames from 'classnames'
import { useDispatch } from 'react-redux'

import IconButton from '../../../chrome/IconButton'
import Icon from '../../../chrome/Icon'
import Button from '../../../chrome/Button'
import { clearModal } from '../../app/state/appActions'
import CronTriggerEditor from '../../trigger/CronTriggerEditor'
import { WorkflowTrigger, WorkflowTriggerType } from '../../../qrimatic/workflow'
import { changeWorkflowTrigger } from '../../workflow/state/workflowActions'

interface AddTriggerModalProps {
  type?: WorkflowTriggerType | ''
  triggers?: WorkflowTrigger[]
}

const AddTriggerModal: React.FC<AddTriggerModalProps> = ({
  type: initialType = '',
  triggers: initialTriggers
}) => {


  const dispatch = useDispatch()

  // type sets the initial display of this modal.
  // if no triggers are present in a workflow, it can be called with no type and
  // will show the UI for choosing what type of trigger to add
  // if called with type='cron', it will allow for editing an existing schedule trigger
  const [ type, setType ] = useState<AddTriggerModalProps['type']>(initialType)

  // this will be the default cron trigger setting when the user chooses "schedule"
  // from the list of available triggers
  const defaultCronTrigger: WorkflowTrigger = {
    type: 'cron',
    periodicity: 'R/2021-01-01T02:00:00.000Z/P1D'
  }

  // manage a collection of triggers in local state until they are "saved"
  const [ triggers, setTriggers ] = useState<WorkflowTrigger[]>(initialTriggers || [ defaultCronTrigger ])

  const handleCancelButtonClick = () => {
    dispatch(clearModal())
  }

  // on save, commit our local collection of triggers to the store
  // and close the modal
  const handleSaveButtonClick = () => {
    dispatch(changeWorkflowTrigger(0, triggers[0]))
    dispatch(clearModal())
  }

  // treat individual trigger editors as controlled inputs
  // this will be passed in as onChange and will update the trigger in local state
  // TODO(chriswhong): handle multiple triggers, for now we assume an array of one WorkflowTrigger
  const handleTriggerChange = (t: WorkflowTrigger) => {
    setTriggers([t])
  }

  // this interface and the array of triggerTypes below are used to render
  // the UI for choosing which type of
  interface TriggerType {
    id: WorkflowTriggerType
    // used in the button for choosing which type of trigger to add/edit
    buttonLabel: string
    description: string
    disabled?: boolean
    // header text and content for the modal when this trigger type is being edited
    label: string
    content?: JSX.Element
  }

  const triggerTypes: TriggerType[] = [
    {
      id: 'cron',
      buttonLabel: 'Schedule',
      description: 'run your workflow at a specific interval (e.g. daily at 11pm)',
      label: 'Schedule Trigger',
      content: ( <CronTriggerEditor trigger={triggers[0]} onChange={handleTriggerChange} /> )
    },
    {
      id: 'webhook',
      buttonLabel: 'Webhook',
      description: 'trigger your script from an external environment',
      disabled: true,
      label: 'Webhook Triggers',
    },
    {
      id: 'dataset',
      buttonLabel: 'Upstream Dataset',
      description: 'set an upstream dataset to listen for changes',
      disabled: true,
      label: 'Upstream Dataset Triggers',
    }
  ]

  // check whether the UI pane for adding a specific type of trigger should be in view
  const currentTriggerType = triggerTypes.find(({ id }) => id === type)

  return (
    <div className='w-96' style={{ minHeight: 430 }}>
      <div className={classNames('absolute w-full bg-white p-8 transition-all duration-300', {
        'left-0': type === '',
        '-left-full': type !== ''
      })}>
        <div className='flex'>
          <div className='flex-grow'>
            <h3 className={classNames('text-2xl leading-6 font-black text-qrinavy mb-5')}>Add a Trigger</h3>
          </div>
          <IconButton icon='close' onClick={handleCancelButtonClick} />
        </div>
        <div className="mb-5 text-base text-qrinavy">
          {triggerTypes.map(({ id, buttonLabel, description, disabled = false }) => {
            return (
              <div
                key={id}
                className={classNames('w-full py-4 px-4 rounded flex border items-center mb-4', {
                  'cursor-pointer': !disabled
                })}
                onClick={() => { setType(id) }}
              >
                <div className='flex-grow'>
                  <div className={classNames('font-bold', {
                    'text-qrinavy': !disabled,
                    'text-qrigray-300': disabled
                  })}>{buttonLabel}</div>
                  <div className={classNames('text-sm', {
                    'text-qrigray-300': disabled
                  })}>{description}</div>
                </div>
                <Icon icon='caretRight' className={classNames({ 'text-qrigray-300': disabled })} />
              </div>
            )
          })}
        </div>
      </div>
      {currentTriggerType && (
        <div className={classNames('bg-white p-8 transition-all flex flex-col')} style={{ minHeight: 430 }}>
          <div className='flex-grow'>
            <div className='flex'>
              <div className='flex-grow'>
                <h3 className={classNames('text-2xl leading-6 font-black mb-5')}>{currentTriggerType.label}</h3>
              </div>
            </div>
            <div className="mb-5 text-base text-qrinavy">
              {currentTriggerType.content}
            </div>
          </div>
          <div>
            <Button className='w-full mb-3' type='secondary' onClick={handleSaveButtonClick}>Save</Button>
            <Button className='w-full' type='light' onClick={handleCancelButtonClick}>Cancel</Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddTriggerModal
