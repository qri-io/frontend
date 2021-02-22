import React from 'react'
import RunStatusBadge from '../run/RunStatusBadge'

import RelativeTimestamp from '../../chrome/RelativeTimestamp'
import ManualTriggerButton from '../manualTrigger/ManualTriggerButton'

const WorkflowRecentActivity: React.FC<any> = () => {
  const data = [
    {
      timestamp: '2021-02-19T16:30:18.555797-05:00',
      username: 'cw-qrimatic-test',
      name: 'dataset_900',
      profileID: 'QmSFsV4KGGyWtQXuyUWox6EdKmvqEvAeGoGiRunmfohbDT',
      runID: '7fa70de1-c90f-4190-b22f-90c33f9d25a1',
      runDuration: 52632000,
      runStatus: 'running'
    },
    {
      timestamp: '2021-02-19T16:29:17.555714-05:00',
      username: 'cw-qrimatic-test',
      name: 'dataset_900',
      profileID: 'QmSFsV4KGGyWtQXuyUWox6EdKmvqEvAeGoGiRunmfohbDT',
      runID: '20d82863-5e55-4d5b-88bb-bca99bae8a9c',
      runDuration: 37656000,
      runStatus: 'succeeded'
    },
    {
      timestamp: '2021-02-19T16:28:16.556357-05:00',
      username: 'cw-qrimatic-test',
      name: 'dataset_900',
      profileID: 'QmSFsV4KGGyWtQXuyUWox6EdKmvqEvAeGoGiRunmfohbDT',
      runID: '1270209a-d723-4b19-8392-3068a9d840df',
      runDuration: 54093000,
      runStatus: 'failed'
    },
    {
      timestamp: '2021-02-19T16:27:16.553234-05:00',
      username: 'cw-qrimatic-test',
      name: 'dataset_900',
      profileID: 'QmSFsV4KGGyWtQXuyUWox6EdKmvqEvAeGoGiRunmfohbDT',
      runID: 'd4e00b12-3116-443f-93d5-712945ac8e68',
      runDuration: 67337000,
      runStatus: 'unchanged'
    },
    {
      timestamp: '2021-02-19T16:26:15.546698-05:00',
      username: 'cw-qrimatic-test',
      name: 'dataset_900',
      profileID: 'QmSFsV4KGGyWtQXuyUWox6EdKmvqEvAeGoGiRunmfohbDT',
      runID: '240bdceb-5b79-43d7-838c-2ea4faf8cfbb',
      runDuration: 62945000,
      runStatus: 'unchanged'
    }
  ]

  const activityItems = data.map(({ runStatus, timestamp }) => {
    return (
      <div className='text-sm flex mb-1 items-center'>
        <div className='grow-none mr-2'>
          <RunStatusBadge status={runStatus} size='xs' />
        </div>
        <div className='text-xs'>
          <RelativeTimestamp timestamp={new Date(timestamp)} />
        </div>
      </div>
    )
  })

  return (
    <div className='py-4 pl-4'>
      <div className='mb-2 flex items-center'>
        <span className='text-sm font-semibold text-gray-600 flex-grow'>Recent Activity</span>
        <ManualTriggerButton workflowID={'foo'}/>
      </div>
      {activityItems}
    </div>
  )
}

export default WorkflowRecentActivity
