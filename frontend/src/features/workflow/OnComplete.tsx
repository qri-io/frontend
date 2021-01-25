import React from 'react'
import Block from './Block';

const onCompleteItems = [
  {
    name: 'Push to Qri Cloud',
    description: 'If the workflow results in a new version of the dataset, it will be published on qri.cloud'
  },
  {
    name: 'Call Webhook',
    description: 'If the workflow results in a new version of the dataset, call http://mywebook.com/somewebhook'
  },
  {
    name: 'Email Workflow Report',
    description: 'Whenever the workflow finishes, email chris@qri.io with a report'
  }
]

const OnComplete: React.FC<any> = () => {
  return (
    <div className='p-4 mb-5'>
      <h2 className='text-2xl font-semibold text-gray-600'>On Completion</h2>
      <div className='text-xs mb-2'>Configure actions that will happen when the workflow succeeds</div>
      <div className='grid grid-flow-col grid-cols-3 -mx-2 overflow-hidden'>
        {onCompleteItems.map((d) => (<Block {...d} />))}
      </div>
    </div>
  )
}

export default OnComplete;