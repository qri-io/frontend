import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { QriRef } from '../../qri/ref'
import useDimensions from 'react-use-dimensions'

import ActivityList from './ActivityList'
import { loadDatasetLogs } from './state/activityFeedActions'
import { newDatasetLogsSelector } from './state/activityFeedState'
import DatasetFixedLayout from '../dataset/DatasetFixedLayout'
import { cancelRun, runNow } from '../workflow/state/workflowActions'
import { selectLatestRunId } from '../workflow/state/workflowState'
import RunNowButton from './RunNowButton'
import { LogItem, NewLogItem } from "../../qri/log"
import { selectRun } from "../events/state/eventsState"
import { trackGoal } from '../../features/analytics/analytics'
import { selectSessionUser } from '../session/state/sessionState'
import { selectDatasetHeader } from "../dataset/state/datasetState"
import { setHeader } from "../dataset/state/datasetActions"
import { addWaitingEvent } from "../events/state/eventsActions"
import Head from '../app/Head'

export interface DatasetActivityFeedProps {
  qriRef: QriRef
}

const DatasetActivityFeed: React.FC<DatasetActivityFeedProps> = ({
  qriRef
}) => {
  const logs = useSelector(newDatasetLogsSelector(qriRef))
  const latestRunId = useSelector(selectLatestRunId)
  const latestRun = useSelector(selectRun(latestRunId))
  const user = useSelector(selectSessionUser)
  const header = useSelector(selectDatasetHeader)
  const isDatasetOwner = user.username === qriRef.username
  const dispatch = useDispatch()

  const [displayLogs, setDisplayLogs] = useState<LogItem[]>(logs)

  const [tableContainer, { height: tableContainerHeight }] = useDimensions()

  useEffect(() => {
    dispatch(loadDatasetLogs({ username: qriRef.username, name: qriRef.name }))
  }, [dispatch, qriRef.username, qriRef.name, latestRun?.status])

  const handleRunNowClick = () => {
    // runlog-run-now event
    trackGoal('GHUGYPYM', 0)
    dispatch(addWaitingEvent('1'))
    dispatch(runNow(qriRef))
    console.log('HERE IN SETTING THE WAITING EVENT')
    const waitingLog: LogItem = NewLogItem({
      commitTime: new Date().toString(),
      runStatus: "waiting",
      title: '--',
      runStart: new Date().toString(),
      runID: latestRun.id
    })
    const newLogs = [waitingLog, ...logs]
    setDisplayLogs(newLogs)
    dispatch(setHeader({ ...header, runCount: header.runCount + 1 }))
  }

  const handleCancelRun = () => {
    dispatch(cancelRun(latestRun.id))
  }

  useEffect(() => {
    if (!displayLogs.length) {
      setDisplayLogs(logs)
    }
  }, [ logs, displayLogs ])

  useEffect(() => {
    if (latestRun.status === 'running' && displayLogs[0].runStatus === 'waiting') {
      const runningLog: LogItem = NewLogItem({
        commitTime: new Date().toString(),
        runStatus: "running",
        title: '--',
        runStart: new Date().toString(),
        runID: latestRun.id
      })
      const filteredWaiting = displayLogs.filter(e => e.runStatus !== 'waiting')
      const newLogs = [runningLog, ...filteredWaiting]
      setDisplayLogs(newLogs)
    }
  }, [ latestRun, displayLogs ])

  useEffect(() => {
    if (logs.length && displayLogs.length && logs.length === displayLogs.length && displayLogs[0].runStatus === 'running') {
      setTimeout(() => setDisplayLogs(logs), 100) // setting timeout to make sure animation finishes
    }
  }, [ logs, displayLogs ])

  return (
    <DatasetFixedLayout headerChildren={<RunNowButton status={displayLogs.length && displayLogs[0].runStatus === 'waiting' ? 'waiting' : latestRun?.status} onClick={handleRunNowClick} onCancel={handleCancelRun} isDatasetOwner={isDatasetOwner} />}>
      <Head data={{
        title: `${qriRef.username}/${qriRef.name} run log | Qri`,
        pathname: location.pathname,
        description: `Explore the automation run log for the Qri Dataset ${qriRef.username}/${qriRef.name}`
      }}/>
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
