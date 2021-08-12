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
import Button from '../../chrome/Button'
import Icon from '../../chrome/Icon'


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

  const handleRunNowClick = () => {
    dispatch(runNow(qriRef))
    // figure out the right time to refresh the logs
    dispatch(loadDatasetLogs(qriRef))
  }

  const runNowButton = (
    <Button type='primary' onClick={handleRunNowClick}><Icon icon='play' className='mr-2'/>Run Now</Button>
  )

  return (
    <DatasetFixedLayout headerChildren={runNowButton}>
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
