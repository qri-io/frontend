import React from 'react'

import ScrollAnchor from '../scroller/ScrollAnchor'
import Block from './Block'
import ContentBox from '../../chrome/ContentBox'

const hooks = [
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
    <ContentBox className='mb-7' paddingClassName='px-5 py-4'>
        <ScrollAnchor id='on-completion' />
        <h2 className='text-2xl font-semibold text-gray-600'>On Completion</h2>
        <div className='text-sm text-qrigray-400 mb-3'>Configure actions that will happen when the workflow succeeds</div>
        <div className='flex flex-wrap -mx-2 overflow-hidden -mx-2 overflow-hidden'>
          {hooks.map((d, i) => (
            <Block key={i} name={d.name}>
              <div className='text-xs text-qrigray-400'>{d.description}</div>
            </Block>
          ))}
        </div>
      </ContentBox>
  )
}

export default OnComplete
