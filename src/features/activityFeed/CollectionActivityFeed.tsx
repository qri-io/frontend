import React from 'react'

import Page from '../app/Page'
import { mapVersionInfo } from '../collection/state/collectionActions'
import ActivityList from './ActivityList'

import activity from './stories/data/activityLog.json'

const CollectionActivityFeed: React.FC<any> = () => {
  return (
    <Page>
      <div className='max-w-screen-xl mx-auto px-10 py-20'>
        <header className='mb-8'>
          <h1 className='text-2xl font-extrabold'>Activity Feed</h1>
        </header>
        <ActivityList log={mapVersionInfo(activity)} containerHeight={1000}/>
      </div>
    </Page>
  )
}

export default CollectionActivityFeed
