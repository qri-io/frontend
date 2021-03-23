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
    <div className='w-full px-10 py-20 overflow-y-auto'>
      <div className='max-w-screen-md mx-auto bg-white rounded-lg'>
        <ActivityList log={logs} showDatasetName={false} />
      </div>
    </div>
  )
}

export default DatasetActivityFeed
