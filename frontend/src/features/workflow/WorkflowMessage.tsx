import React from 'react'

import Icon from '../../chrome/Icon'

export interface WorkflowMessageProps {
}

const WorkflowMessage: React.FC<WorkflowMessageProps> = () => {
  return (
    <div className='flex shadow-sm bg-white'>
      <div className='w-2 bg-green-400' />
      <div className='py-1 pl-2'>
        <Icon icon='check' className='text-green-400' size='sm' />
      </div>
      <div className='flex flex-col flex-grow py-2 px-2' style={{ fontSize: '8px' }}>
        <div className='text-xs font-semibold mb-1'>Workflow Deployed</div>
        <div className='text-xs font-light mb-1'>Next run at 11:00pm EST</div>
        <div className='text-xs font-light text-qrilightblue font-medium underline'><a href=''>show collection</a></div>
      </div>
      <div className='pr-2'>
        <Icon icon='times' className='text-gray-600' size='xs' />
      </div>
    </div>
  )
}

export default WorkflowMessage
