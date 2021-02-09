import React from 'react'
import { Link } from 'react-router-dom'
import ReactDataTable from 'react-data-table-component'
import numeral from 'numeral'

import Icon from '../../chrome/Icon'
import RunStatusBadge from './RunStatusBadge'

import { ActivityItem } from '../../qri/activity'

interface ActivityFeedProps {
  activity: ActivityItem[]
  showDatasetName?: Boolean
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activity, showDatasetName=true }) => {
  // react-data-table column definitions
  const columns = [
    {
      name: 'status',
      selector: 'status',
      width: '200px',
      cell: (row: ActivityItem) => {
        const status = row.type === 'run' ? row.status : 'manual-commit'
        return (
          <RunStatusBadge status={status} />
        )
      }
    },
    {
      name: 'name',
      selector: 'name',
      grow: 2,
      omit: !showDatasetName,
      cell: (row: ActivityItem) => {
        const { username, name } = row
        return (
          <div className='hover:text-qrilightblue hover:underline'>
            <Link to={`/ds/${username}/${name}`}>{username}/{name}</Link>
          </div>
        )
      }
    },
    {
      name: 'start',
      selector: 'start',
      width: '100px',
      cell: (row: ActivityItem) => {
        return <div>20m ago</div>
      }
    },
    {
      name: 'duration',
      selector: 'duration',
      width: '100px',
      cell: (row: ActivityItem) => {
        return <div>45s</div>
      }
    },
    {
      name: 'commit',
      selector: 'name',
      width: '300px',
      cell: (row: ActivityItem) => {
        if (!['error', 'no-changes'].includes(row.status)) {
          return (
            <div className='p-3'>
              <div className='font-medium text-sm mb-1'>
                <div className='font-mono'><Icon icon='commit' size='sm'/> {row.path.substring(row.path.length - 7)}</div>
              </div>
              <div className='text-gray-500 text-xs'>
                <span className='mr-4'><Icon icon='hdd' size='sm' className='mr-1' />{numeral(row.bodySize).format('0.0 b')}</span>
                <span className='mr-4'><Icon icon='bars' size='sm' className='mr-1' />{numeral(row.bodyRows).format('0,0a')} rows</span>
                <span className='mr-4'><Icon icon='file' size='sm' className='mr-1' />{row.bodyFormat}</span>
              </div>
            </div>
          )
        } else {
          return <div className='text-center w-full'>--</div>
        }
      }
    },
  ]

  return (
    <ReactDataTable
      columns={columns}
      data={activity}
      noHeader
    />
  )
}

export default ActivityFeed
