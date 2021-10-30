import React from 'react'

import ScrollAnchor from '../scroller/ScrollAnchor'
import Block from './Block'

const hooks = [
  {
    name: 'Push to Qri Cloud',
    description: 'If the workflow results in a new version of the dataset, it will be published on qri.cloud'
  },
  {
    name: 'Call Webhook',
    description: 'If the workflow results in a new version of the dataset, call http://mywebhook.com/foo'
  },
  {
    name: 'Email Workflow Report',
    description: 'Whenever the workflow finishes, email chris@qri.io with a report'
  }
]

const OnComplete: React.FC<any> = () => {
  return (
    <div className='flex'>
      <div className='flex-grow min-w-0'>
        <ScrollAnchor id='on-completion' />
        <h2 className='text-xl font-bold text-black'>On Completion</h2>
        <div className='text-base text-qrigray-400 mb-3'>Configure actions that will happen when the workflow succeeds</div>
        <div className='flex flex-wrap -mx-2 overflow-hidden -mx-2 overflow-hidden'>
          {hooks.map((d, i) => (
            <div key={i} className='w-1/3'>
              <Block name={d.name}>
                <div className='text-xs text-qrigray-400'>{d.description}</div>
              </Block>
            </div>
          ))}
        </div>
      </div>
      <div className='flex-shrink-0 w-48 ml-8'>
        {/* TODO (chriswhong): this is a sidebar placeholder that matches the width of the contextual menu which appears to the right of code cells */}
      </div>
    </div>
  )
}

export default OnComplete
