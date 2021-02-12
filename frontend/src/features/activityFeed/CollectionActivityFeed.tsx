import React from 'react'

import { LogItem } from '../../qri/log'
import UserPageLayout from '../app/UserPageLayout'
import ActivityList from './ActivityList'

import activity from './stories/data/activityLog.json'

const CollectionActivityFeed: React.FC<any> = () => {
  return (
    <UserPageLayout>
      <div className='max-w-screen-xl mx-auto px-10 py-20'>
        <header className='mb-8'>
          <h1 className='text-2xl font-extrabold'>Activity Feed</h1>
        </header>
        <ActivityList log={activity as LogItem[]}/>
      </div>
    </UserPageLayout>
  )
}

export default CollectionActivityFeed
