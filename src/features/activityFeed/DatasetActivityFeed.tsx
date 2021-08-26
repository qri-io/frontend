import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useDimensions from 'react-use-dimensions'

import { QriRef } from '../../qri/ref'
import ActivityList from './ActivityList'
import { loadDatasetLogs } from './state/activityFeedActions'
import { newDatasetLogsSelector } from './state/activityFeedState'
import DatasetFixedLayout from '../dataset/DatasetFixedLayout'
import { runNow } from '../workflow/state/workflowActions'
import { selectLatestRun } from '../workflow/state/workflowState'
import RunNowButton from './RunNowButton'
import useDidMountEffect from '../../utils/useDidMountEffect'


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

  // TODO(chriswhong): we are already dispatching loadDatsetLogs() in DatasetWrapper
  // because we need the same activity list for both the commit list and the run log
  // once we have a top-level dataset metainfo response, this component will need
  // to call for data on its own
  // useEffect(() => {
  //   dispatch(loadDatasetLogs(qriRef))
  // },[dispatch, qriRef])


  // useDidMountEffect behaves like useEffect but does not run on the first render
  // this will fetch a new activitylist when latestRun.status changes, keeping the run log fresh
  useDidMountEffect(() => {
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
