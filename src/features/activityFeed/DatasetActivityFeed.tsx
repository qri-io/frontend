import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { QriRef } from '../../qri/ref'
import useDimensions from 'react-use-dimensions'

import ActivityList from './ActivityList'
import { loadDatasetLogs } from './state/activityFeedActions'
import { newDatasetLogsSelector } from './state/activityFeedState'
import DatasetFixedLayout from '../dataset/DatasetFixedLayout'
import { runNow } from '../workflow/state/workflowActions'
import { selectLatestRunId } from '../workflow/state/workflowState'
import RunNowButton from './RunNowButton'
import { selectRun } from "../events/state/eventsState";
import { LogItem, NewLogItem } from "../../qri/log";


export interface DatasetActivityFeedProps {
  qriRef: QriRef
}

const DatasetActivityFeed: React.FC<DatasetActivityFeedProps> = ({
  qriRef
}) => {
  const logs = useSelector(newDatasetLogsSelector(qriRef))
  const latestRunId = useSelector(selectLatestRunId)
  const latestRun = useSelector(selectRun(latestRunId))
  const dispatch = useDispatch()

  const [displayLogs, setDisplayLogs] = useState<LogItem[]>(logs)

  const [tableContainer, { height: tableContainerHeight }] = useDimensions()


  useEffect(() => {
    dispatch(loadDatasetLogs({username: qriRef.username, name: qriRef.name}))
  },[dispatch, qriRef.username, qriRef.name, latestRun?.status])

  const handleRunNowClick = () => {
    dispatch(runNow(qriRef))
  }

  useEffect(() => {
    if (latestRun.status === 'running') {
      const runningLog:LogItem = NewLogItem({
        timestamp: new Date().toString(),
        runStatus: "running",
        title: '--',
        runID: latestRun.id,
      })
      const newLogs = [runningLog, ...logs]
      setDisplayLogs(newLogs)
    }
    // eslint-disable-next-line
  }, [ latestRun ])


  useEffect(() => {
    if (!displayLogs.length) {
      setDisplayLogs(logs)
    }
  }, [ logs, displayLogs ])

  useEffect(() => {
    if (latestRun.status === "succeeded" || latestRun.status === "failed") {
      setTimeout(() => setDisplayLogs(logs), 800) //setting timeout to make sure animation finishes
    }
  }, [ logs, latestRun ])

  return (
    <DatasetFixedLayout headerChildren={<RunNowButton status={latestRun?.status} onClick={handleRunNowClick} />}>
      <div ref={tableContainer} className='overflow-y-hidden rounded-lg relative flex-grow bg-white'>
        <div className='rounded-none h-full'>
          <ActivityList
            log={displayLogs}
            showDatasetName={false}
            containerHeight={tableContainerHeight}
          />
        </div>
      </div>
    </DatasetFixedLayout>
  )
}

export default DatasetActivityFeed
