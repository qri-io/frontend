import React from 'react'

import { LogItem } from '../../qri/log'
import Page from '../app/Page'
import ActivityList from './ActivityList'

import activity from './stories/data/activityLog.json'

const CollectionActivityFeed: React.FC<any> = () => {
  return (
    <Page>
      <div className='max-w-screen-xl mx-auto px-10 py-20'>
        <header className='mb-8'>
          <h1 className='text-2xl font-extrabold'>Activity Feed</h1>
        </header>
        <ActivityList log={activity as LogItem[]}/>
      </div>
    </Page>
  )
}

export default CollectionActivityFeed
