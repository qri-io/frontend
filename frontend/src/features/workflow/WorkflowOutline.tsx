import React from 'react'

import Icon from '../../chrome/Icon'

export interface WorkflowOutlineProps {}

const WorkflowOutline: React.FC<WorkflowOutlineProps> = () => {
  return (
    <div className='p-4 text-left'>
      <div className='font-semibold text-gray-600 mb-2'>Triggers</div>
        <div className='text-xs inline-block py-1 px-2 rounded border'>
          <Icon icon='clock'/>
        </div>
        <div className='text-xs inline-block py-1 px-2 rounded border'>
          <Icon icon='projectDiagram'/>
        </div>
        <div className='text-xs inline-block py-1 px-2 rounded border'>
          <Icon icon='bolt'/>
        </div>
      <div  className='font-semibold text-gray-600 mb-2'>
        Script <div className='float-right text-blue-500'><Icon icon='spinner' spin /></div>
      </div>
      <div className='mb-2'>
        <div className='text-sm ml-2'><span className='font-black text-gray-400'>1</span> &nbsp; Setup <div className='float-right text-green-500'><Icon icon='check' /></div></div>
        <div className='text-sm ml-2'><span className='font-black text-gray-400'>2</span> &nbsp; Download <div className='float-right text-green-500'><Icon icon='check' /></div></div>
        <div className='text-sm ml-2'><span className='font-black text-gray-400'>3</span> &nbsp; Transform <div className='float-right text-red-500'><Icon icon='check' /></div></div>
        <div className='text-sm ml-2'><span className='font-black text-gray-400'>4</span> &nbsp; Save <div className='float-right text-yellow-500'><Icon icon='exclamationCircle' /></div></div>
      </div>
      <div className='font-semibold text-gray-600 mb-2'>On Completion</div>
      <div className='text-xs inline-block py-1 px-2 rounded border'>
        <Icon icon='cloudUpload'/>
      </div>
      <div className='text-xs inline-block py-1 px-2 rounded border'>
        <Icon icon='bolt'/>
      </div>
      <div className='text-xs inline-block py-1 px-2 rounded border'>
        <Icon icon='envelope'/>
      </div>
      <button
        className='mt-4 py-1 px-4 w-full font-semibold shadow-md text-white bg-gray-600 hover:bg-gray-300 rounded'
      >
        Deploy Workflow
      </button>
    </div>
  )
}

export default WorkflowOutline
