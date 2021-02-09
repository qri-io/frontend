import React from 'react'
import { QriRef } from '../../qri/ref'

import ActivityList from './ActivityList'

import activity from './stories/data/activityLog.json'

export interface DatasetActivityFeedProps {
  qriRef: QriRef
}

const DatasetActivityFeed: React.FC<DatasetActivityFeedProps> = ({
  qriRef
}) => {

  return (
    <div className='max-w-screen-xl mx-auto px-10 py-20'>
      <header className='mb-8'>
        <h1 className='text-2xl font-extrabold'>Activity Feed</h1>
      </header>
      <ActivityList log={activity} showDatasetName={false} />
    </div>
  )
}

export default DatasetActivityFeed
