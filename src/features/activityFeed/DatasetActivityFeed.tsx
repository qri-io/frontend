import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { QriRef } from '../../qri/ref'
import useDimensions from 'react-use-dimensions'

import ActivityList from './ActivityList'
import { loadDatasetLogs } from './state/activityFeedActions'
import { newDatasetLogsSelector } from './state/activityFeedState'
import DatasetFixedLayout from '../dataset/DatasetFixedLayout'
import { runNow } from '../workflow/state/workflowActions'
import { selectLatestRun } from '../workflow/state/workflowState'
import RunNowButton from './RunNowButton'


export interface DatasetActivityFeedProps {
  qriRef: QriRef
}

const DatasetActivityFeed: React.FC<DatasetActivityFeedProps> = ({
  qriRef
}) => {

  const logs = useSelector(newDatasetLogsSelector(qriRef))
  const latestRun = useSelector(selectLatestRun)
  const dispatch = useDispatch()

  const [tableContainer, { height: tableContainerHeight }] = useDimensions()

  useEffect(() => {
    dispatch(loadDatasetLogs(qriRef))
  },[dispatch, qriRef])

  useEffect(() => {
    dispatch(loadDatasetLogs(qriRef))
  },[dispatch, qriRef])

  useEffect(() => {
    dispatch(loadDatasetLogs(qriRef))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[latestRun?.status])

  const handleRunNowClick = () => {
    dispatch(runNow(qriRef))
  }


  return (
    <DatasetFixedLayout headerChildren={<RunNowButton status={latestRun?.status} onClick={handleRunNowClick} />}>
      <div ref={tableContainer} className='overflow-y-hidden rounded-lg relative flex-grow bg-white relative'>
        <ActivityList
          log={logs}
          showDatasetName={false}
          containerHeight={tableContainerHeight}
        />
      </div>
    </DatasetFixedLayout>
  )
}

export default DatasetActivityFeed
