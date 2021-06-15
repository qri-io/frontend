import React from 'react'

import { TriggerEditorProps } from './WorkflowTriggersEditor'
import Block from '../workflow/Block'

const CronTriggerEditor: React.FC<TriggerEditorProps> = ({
  trigger,
  onChange
}) => {
  return (
    <Block name='Schedule'>
      <span className="text-sm leading-6 font-medium text-gray-700 mr-1" id="modal-headline">Run this script every</span>
      <select className='text-gray-800 font-semibold border-b bg-gray-100' value={trigger.periodicity} onChange={(e: any) => {
        onChange({
          type: trigger.type,
          id: trigger.id,
          workflowID: trigger.workflowID,
          periodicity: e.target.value,
        })
      }}>
        <option value="">--</option>
        <option value="R/PT10M">10 Minutes</option>
        <option value="R/PT1H">Hour</option>
        <option value="R/PT1D">Day</option>
        <option value="R/PT1W">Week</option>
        <option value="R/PT1M">Month</option>
        <option value="R/PT3M">Quarter</option>
      </select>
    </Block>
  )
}

export default CronTriggerEditor
