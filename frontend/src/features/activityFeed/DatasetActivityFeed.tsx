import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { QriRef } from '../../qri/ref'

import ActivityList from './ActivityList'
import { loadDatasetLogs } from './state/activityFeedActions'
import { newDatasetLogsSelector } from './state/activityFeedState'

export interface DatasetActivityFeedProps {
  qriRef: QriRef
}

const DatasetActivityFeed: React.FC<DatasetActivityFeedProps> = ({
  qriRef
}) => {

  const logs = useSelector(newDatasetLogsSelector(qriRef))
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(loadDatasetLogs(qriRef))
  },[dispatch, qriRef])

  return (
    <div className='max-w-screen-xl mx-auto px-10 py-20'>
      <header className='mb-8'>
        <h1 className='text-2xl font-extrabold'>Activity Feed</h1>
      </header>
      <ActivityList log={logs} showDatasetName={false} />
    </div>
  )
}

export default DatasetActivityFeed
