import React from 'react'

import ScrollAnchor from '../scroller/ScrollAnchor'
import Block from './Block'

const hooks = [
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
      <div className='flex-grow min-w-0 text-qrigray-300'>
        <ScrollAnchor id='on-completion' />
        <div className='flex items-center'>
          <h2 className='text-xl font-bold '>On Completion</h2>
          <span className='text-sm ml-3'>(This feature is coming soon)</span>
        </div>

        <div className='text-base mb-3'>Configure actions that will happen when the workflow succeeds</div>
        <div className='flex flex-wrap -mx-2 overflow-hidden -mx-2 overflow-hidden'>
          {hooks.map((d, i) => (
            <div key={i} className='w-1/2'>
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
