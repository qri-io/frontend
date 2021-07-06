import React, { useState, useEffect } from 'react'

import { TriggerEditorProps } from './WorkflowTriggersEditor'
import DropdownMenu from '../../chrome/DropdownMenu'
import Icon from '../../chrome/Icon'
import { CronTrigger } from '../../qrimatic/workflow'
import { Schedule, scheduleFromPeriodicity, hourlyItems, triggerFromSchedule, periodicityItems } from './util'

interface CronTriggerEditorProps extends TriggerEditorProps {
  trigger: CronTrigger
}

const CronTriggerEditor: React.FC<CronTriggerEditorProps> = ({
  // for setting the initial state
  trigger,
  onChange
}) => {
  // store the UI selections in local state
  // we'll convert them to the correct format for the trigger in useEffect()
  const [ schedule, setSchedule] = useState<Schedule>(scheduleFromPeriodicity(trigger.periodicity))

  useEffect(() => {
    // when the user interacts with the UI, convert the selected values into a
    // valid trigger and send the new trigger up to AddTriggerModal
    onChange(triggerFromSchedule(schedule))
  }, [ schedule ])

  const handlePeriodicityChange = (value: string) => {
    setSchedule({
      ...schedule,
      periodicity: value,
    })
  }

  const handleMinutesChange = (value: string) => {
    setSchedule({
      ...schedule,
      minutes: value,
    })
  }

  const handleTimeChange = (value: string) => {
    setSchedule({
      ...schedule,
      time: value,
    })
  }

  const selectedPeriodicityItem = periodicityItems.find((d) => d.value === schedule.periodicity)

  if (selectedPeriodicityItem === undefined) {
    throw new TypeError('invalid periodicity value')
  }

  const selectedHourlyItem = hourlyItems.find((d) => d.value === schedule.minutes)

  if (selectedHourlyItem === undefined) {
    throw new TypeError('invalid hourly minutes value')
  }


  const DropdownContent:React.FC = ({ children }) => (
    <div className='border border-qrigray-300 rounded-lg text-qrigray-400 text-xs font-normal px-2 py-2 cursor-pointer w-full flex items-center'>
      <div className='flex-grow'>{children}</div>
      <Icon icon='caretDown' size='2xs' className='ml-3' />
    </div>
  )

  return (
    <div>
      <div className="text-sm leading-6 font-medium text-gray-700 mr-1" id="modal-headline">When should Qri run this workflow?</div>
      <div className='flex flex-wrap -mx-1'>
        <div className='my-1 px-1 w-1/2'>
          <DropdownMenu items={periodicityItems} onChange={handlePeriodicityChange} selectedValue={selectedPeriodicityItem.value} alignLeft>
            <DropdownContent>
              {selectedPeriodicityItem.label}
            </DropdownContent>
          </DropdownMenu>
        </div>
        <div className='my-1 px-1 w-1/2'>
          {
            // show minutes selector
            schedule.periodicity === 'hourly' && (
              <DropdownMenu items={hourlyItems} onChange={handleMinutesChange} selectedValue={selectedHourlyItem.value} alignLeft>
                <DropdownContent>
                  {selectedHourlyItem.label}
                </DropdownContent>
              </DropdownMenu>
            )
          }
          {
            // show a time selector
            schedule.periodicity === 'daily' && (
              <input
                className='border border-qrigray-300 rounded-lg text-qrigray-400 text-xs font-normal px-2 w-full'
                style={{
                  paddingTop: 6.75,
                  paddingBottom: 6.75
                }}
                type='time'
                value={schedule.time}
                onChange={(e) => { handleTimeChange(e.target.value)}}
              />
            )
          }
        </div>
      </div>
    </div>
  )
}

export default CronTriggerEditor
