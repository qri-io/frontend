import React from 'react'
import Block from './Block';
import { faBolt, faCloudUploadAlt, faEnvelope, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const onCompleteItems = [
  {
    name: 'Push to Qri Cloud',
    description: 'If the workflow results in a new version of the dataset, it will be published on qri.cloud',
    icon: faCloudUploadAlt
  },
  {
    name: 'Call Webhook',
    description: 'If the workflow results in a new version of the dataset, call http://mywebook.com/somewebhook',
    icon: faBolt
  },
  {
    name: 'Email Workflow Report',
    description: 'Whenever the workflow finishes, email chris@qri.io with a report',
    icon: faEnvelope
  }
]

const OnComplete: React.FC<any> = () => {
  return (
    <div className='p-4 mb-5'>
      <div>
        <div className='text-2xl font-semibold text-gray-600 mb-1 inline-block'>On Completion</div>
        <div className='float-right border py-1 px-2 rounded'><FontAwesomeIcon icon={faPlus} /></div>
      </div>
      <div className='text-xs mb-2'>Configure actions that will happen when the workflow succeeds</div>
      <div className='grid grid-flow-col grid-cols-3 -mx-2 overflow-hidden'>
        {onCompleteItems.map((d, i) => (<Block key={i} {...d} />))}
      </div>
    </div>
  )
}

export default OnComplete;
