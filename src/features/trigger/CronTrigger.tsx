import React from 'react'
import { useDispatch } from 'react-redux'

import Icon from '../../chrome/Icon'
import Link from '../../chrome/Link'
import { WorkflowTrigger } from '../../qrimatic/workflow'
import Block from '../workflow/Block'
import { showModal } from '../app/state/appActions'
import { ModalType } from '../app/state/appState'
import { parseHourlyStart, parseDailyStart,  } from './util'

export interface CronTriggerProps {
  trigger: WorkflowTrigger
}

const CronTrigger: React.FC<CronTriggerProps> = ({
  trigger
}) => {

  const dispatch = useDispatch()

  // on edit, open AddTriggerModal and pass in the correct type and array of WorkflowTrigger
  const handleEditClick = () => {
    dispatch(showModal(ModalType.addTrigger, {
      type: 'cron',
      triggers: [ trigger ]
    }))
  }

  // split the ISO8601 repeating interval (R/{starttime}/{interval})
  const [, startTime, interval] = trigger.periodicity.split('/')


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

  return (
    <Block>
      <div className='flex'>
        <div className='flex-grow'>
          <div id='cron_trigger_schedule' className='text-sm font-semibold pb-1 text-qrinavy'>Schedule</div>
          <div className='text-qrigray-400 text-xs flex items-center'>
            <Icon icon='calendar' size='sm' className='mr-1 pt-1' />
            <div id='cron_trigger_interval_text'>{displayInterval} {displayStartTime}</div>
          </div>
        </div>
        <div className='flex ml-2'>
          <Link
            className='text-qrigray-400 text-xs self-end mb-0.5'
            colorClassName='text-qrigray-400 hover:text-qrigray-600'
            onClick={handleEditClick}
          >Edit</Link>
        </div>
      </div>
    </Block>
  )
}

export default CronTrigger
