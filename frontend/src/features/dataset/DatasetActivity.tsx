import React from 'react'

import ActivityList from '../activity/ActivityList'

import activity from '../activity/stories/data/activity.json'


const DatasetHistory: React.FC<any> = () => {
  return (
    <div className='bg-gray-100 px-4 py-10'>
      <header className='mb-8'>
        <h1 className='text-2xl font-extrabold'>Dataset Activity</h1>
      </header>
      <ActivityList showDatasetName={false} activity={activity}/>
    </div>
  )
}

export default DatasetHistory;
