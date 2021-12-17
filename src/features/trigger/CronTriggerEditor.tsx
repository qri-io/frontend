import React from 'react'

import { TriggerEditorProps } from './WorkflowTriggersEditor'
import { CronTrigger } from '../../qrimatic/workflow'
import { hourlyItems, scheduleFromPeriodicity, triggerFromSchedule } from './util'
import Select from '../../chrome/Select'
import Button from "../../chrome/Button"

interface CronTriggerEditorProps extends TriggerEditorProps {
  trigger: CronTrigger
  onSave: () => void
  onDelete: () => void
}

const CronTriggerEditor: React.FC<CronTriggerEditorProps> = ({
  trigger,
  onChange,
  onSave,
  onDelete
}) => {
  const schedule = scheduleFromPeriodicity(trigger.periodicity)

  return (
    <div className=''>
      <div className=''>
        <div className='mb-2'>
          <Select
            value={schedule.periodicity}
            onChange={(value: string) => {
              onChange(triggerFromSchedule({
                ...schedule,
                periodicity: value
              }))
            }}
            size='sm'
            options={[
              { value: 'PT10M', label: 'Every 10 Minutes' },
              { value: 'P1H', label: 'Every Hour' },
              { value: 'P1D', label: 'Every Day' }
              // { value: 'P1W',   label: 'Every Week' },
              // { value: 'P1M',   label: 'Monthly' }
            ]}
            fullWidth
          />
        </div>
        <div className='mb-2'>
          {
            // show minutes selector
            schedule.periodicity === 'P1H' && (
              <Select
                value={schedule.minutes || '00'}
                onChange={(value: string) => {
                  onChange(triggerFromSchedule({
                    ...schedule,
                    minutes: value
                  }))
                }}
                size='sm'
                options={hourlyItems}
                fullWidth
              />
            )
          }
          {
            // show a time selector
            schedule.periodicity === 'P1D' && (
              <input
                className='border border-qrigray-300 rounded text-qrigray-400 text-xs font-normal px-2 w-full focus:border-qripink-600 focus:ring-transparent'
                style={{
                  paddingTop: 0.8,
                  paddingBottom: 0.8,
                  fontSize: 8
                }}
                type='time'
                value={schedule.time}
                onChange={(e) => {
                  onChange(triggerFromSchedule({
                    ...schedule,
                    time: e.target.value
                  }))
                }}
              />
            )
          }
        </div>
      </div>
      <div className='flex mt-3'>
        <div className='flex-grow mr-1'>
          <Button onClick={onDelete} className='w-full' type='light' size='xs' >Delete</Button>
        </div>
        <div className='flex-grow ml-1'>
          <Button id='add_trigger_save_button' className='w-full' onClick={onSave} type='primary' size='xs' >Complete</Button>
        </div>
      </div>
    </div>
  )
}

export default CronTriggerEditor
