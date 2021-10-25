import React from 'react'

import { TriggerEditorProps } from './WorkflowTriggersEditor'
import { CronTrigger } from '../../qrimatic/workflow'
import { hourlyItems, scheduleFromPeriodicity, triggerFromSchedule } from './util'
import Select from '../../chrome/Select'
import Button from "../../chrome/Button";

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
    <div className='flex items-center'>
      <div className='flex flex-wrap -mx-1 flex-grow'>
        <div className='my-1 px-1 w-1/2'>
          <Select
            value={schedule.periodicity}
            onChange={(value: string) => {
              onChange(triggerFromSchedule({
                ...schedule,
                periodicity: value,
              }))
            }}
            options={[
              { value: 'PT10M', label: 'Every 10 Minutes' },
              { value: 'P1H',   label: 'Every Hour' },
              { value: 'P1D',   label: 'Every Day' },
              // { value: 'P1W',   label: 'Every Week' },
              // { value: 'P1M',   label: 'Monthly' }
            ]}
          />
        </div>
        <div className='my-1 px-1 w-1/2'>
          {
            // show minutes selector
            schedule.periodicity === 'P1H' && (
              <Select
                value={schedule.minutes || '00'}
                onChange={(value: string) => {
                  onChange(triggerFromSchedule({
                    ...schedule,
                    minutes: value,
                  }))
                }}
                options={hourlyItems}
              />
            )
          }
          {
            // show a time selector
            schedule.periodicity === 'P1D' && (
              <input
                className='border border-qrigray-300 rounded-lg text-qrigray-400 text-xs font-normal px-2 w-full'
                style={{
                  paddingTop: 3.8,
                  paddingBottom: 3.8
                }}
                type='time'
                value={schedule.time}
                onChange={(e) => {
                  onChange(triggerFromSchedule({
                    ...schedule,
                    time: e.target.value,
                  }))
                }}
              />
            )
          }
        </div>
      </div>
      <Button onClick={onDelete} className='ml-14 mr-2' type='light'>Delete</Button>
      <Button id='add_trigger_save_button' onClick={onSave} type='secondary'>Complete</Button>
    </div>
  )
}

export default CronTriggerEditor
