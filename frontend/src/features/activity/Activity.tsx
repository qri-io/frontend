import React from 'react'

import PageLayout from '../app/PageLayout'
import ActivityList from './ActivityList'

import activity from './stories/data/activity.json'

const ActivityFeed: React.FC<any> = () => {

  return (
    <PageLayout>
      <div className='max-w-screen-xl mx-auto px-10 py-20'>
        <header className='mb-8'>
          <h1 className='text-2xl font-extrabold'>Activity Feed</h1>
        </header>
        <ActivityList activity={activity}/>
      </div>
    </PageLayout>
  )
}

export default ActivityFeed
