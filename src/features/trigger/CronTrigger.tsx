import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import Icon from '../../chrome/Icon'
import { CronTrigger as CronTriggerType, WorkflowTrigger } from '../../qrimatic/workflow'
import { parseHourlyStart, parseDailyStart } from './util'
import CronTriggerEditor from "./CronTriggerEditor"
import { changeWorkflowTrigger, deleteWorkflowTrigger } from "../workflow/state/workflowActions"

export interface CronTriggerProps {
  trigger: WorkflowTrigger
  onCreateDelete: () => void
  editMode?: boolean
}

const CronTrigger: React.FC<CronTriggerProps> = ({
  trigger: initialTrigger,
  onCreateDelete,
  editMode
}) => {
  const dispatch = useDispatch()

  // manage a collection of triggers in local state until they are "saved"
  const [ triggers, setTriggers ] = useState<WorkflowTrigger[]>([initialTrigger])
  const [ isEditable, setIsEditable ] = useState(!!editMode)
  // on edit, open AddTriggerModal and pass in the correct type and array of WorkflowTrigger

  const handleSaveTrigger = () => {
    setIsEditable(false)
    onCreateDelete()
    dispatch(changeWorkflowTrigger(0, triggers[0]))
  }

  const handleTriggerDelete = () => {
    setIsEditable(false)
    onCreateDelete()
    dispatch(deleteWorkflowTrigger(0))
  }

  const handleTriggerChange = (t: WorkflowTrigger) => {
    setTriggers([t])
  }

  // split the ISO8601 repeating interval (R/{starttime}/{interval})
  const cronTrigger = triggers[0] as CronTriggerType
  const [, startTime, interval] = cronTrigger.periodicity.split('/')

  let displayInterval, displayStartTime

  switch (interval) {
    case 'PT10M':
      displayInterval = 'Every 10 minutes'
      // no startTime for 10-minute intervals, they will always run on the 10s, but this is not made explicit
      break
    case 'P1H':
      displayInterval = 'Every hour'
      displayStartTime = parseHourlyStart(startTime)
      break
    case 'P1D':
      displayInterval = 'Every day'
      displayStartTime = parseDailyStart(startTime)
      break
    default:
      displayInterval = ''
  }

  const onEdit = () => {
    if (!isEditable) {
      setIsEditable(true)
    }
  }

  return (
    <div onClick={onEdit} className='w-full cursor-pointer'>
      <div className='flex w-full items-center'>
        <div className='flex-grow flex items-center'>
          <div id='cron_trigger_schedule' className='text-sm font-semibold mr-2.5 text-black'>Schedule</div>
          {!isEditable && <div className='text-qrigray-400 text-xs flex items-center'>
            <Icon icon='calendar' size='sm' className='mr-1' />
            <div id='cron_trigger_interval_text'>{displayInterval} {displayStartTime}</div>
          </div>}
        </div>
      </div>
      {isEditable &&
      <div className='w-full'>
        <div className='text-qrigray-700 text-xs'>Repeat</div>
        <CronTriggerEditor
          trigger={cronTrigger}
          onChange={handleTriggerChange}
          onSave={handleSaveTrigger}
          onDelete={handleTriggerDelete}/>
      </div>}
    </div>
  )
}

export default CronTrigger
