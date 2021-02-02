import React from 'react'

import Icon from '../../chrome/Icon'

export interface WorkflowOutlineProps {
  status: any
  onStatusButtonClick?: any
}

const WorkflowOutline: React.FC<WorkflowOutlineProps> = ({ status, onStatusButtonClick }) => {
  let statusProps = {
    statusIcon: 'circle',
    statusText: 'Not Deployed',
    statusIconClass: 'text-gray-500',
    message : 'This workflow is not deployed yet.  Edit your script here, use a Dry Run to confirm that it is working, then Deploy it!',
    buttonIcon: 'playCircle',
    buttonClass: 'bg-qrilightblue hover:bg-qrilightblue-light',
    buttonText: 'Deploy Workflow'
  }

  if (status === 'deployed') {
    statusProps = {
      statusIcon: 'playCircle',
      statusIconClass: 'text-green-500',
      statusText: 'Deployed',
      message : 'This workflow is deployed and will run based on the triggers you’ve defined.    ',
      buttonIcon: 'pauseCircle',
      buttonClass: 'bg-gray-500 hover:bg-gray-400',
      buttonText: 'Pause Workflow'
    }
  }

  return (
    <div className='py-4 pl-4'>
      <div className='mb-2' >
        <Icon icon={statusProps.statusIcon} className={`text-gray-300 mr-3 ${statusProps.statusIconClass}`} size='md'  /><span className='text-sm font-semibold text-gray-600'>{statusProps.statusText}</span>
      </div>
      <div className='text-xs mb-4'>
        {statusProps.message}
      </div>
      <button
        className={`w-full py-1 px-4 w-full font-semibold shadow-md text-white rounded flex items-center justify-center ${statusProps.buttonClass}`}
        onClick={onStatusButtonClick}
      >
        <Icon icon={statusProps.buttonIcon} className='text-sm mr-2'/> {statusProps.buttonText}
      </button>
    </div>
  )
}

export default WorkflowOutline
