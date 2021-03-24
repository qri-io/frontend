import React from 'react'
import { Link } from 'react-router-dom'
import ReactDataTable from 'react-data-table-component'
import numeral from 'numeral'

import DurationFormat from '../../chrome/DurationFormat'
import RelativeTimestamp from '../../chrome/RelativeTimestamp'
import Icon from '../../chrome/Icon'
import RunStatusBadge from '../run/RunStatusBadge'
import { LogItem } from '../../qri/log'

interface ActivityListProps {
  log: LogItem[]
  showDatasetName?: boolean
}

const ActivityList: React.FC<ActivityListProps> = ({
  log,
  showDatasetName = true
}) => {
  // react-data-table column definitions
  const columns = [
    {
      name: 'status',
      selector: 'status',
      width: '200px',
      cell: (row: LogItem) => <RunStatusBadge status={row.runStatus} />
    },
    {
      name: 'name',
      selector: 'name',
      grow: 2,
      omit: !showDatasetName,
      cell: (row: LogItem) => {
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
      cell: (row: LogItem) => {
        return <div><RelativeTimestamp timestamp={new Date(row.timestamp)} /></div>
      }
    },
    {
      name: 'duration',
      selector: 'duration',
      width: '100px',
      cell: (row: LogItem) => {
        return <div><DurationFormat seconds={Math.ceil(row.runDuration / 1000000000)} /></div>
      }
    },
    {
      name: 'commit',
      selector: 'name',
      width: '300px',
      cell: (row: LogItem) => {
        if (!['failed', 'unchanged'].includes(row.runStatus)) {
          return (
            <div className='p-3'>
              <div className='font-medium text-sm mb-1'>
                {row.path && <div className='font-mono'><Icon icon='commit' size='sm'/> {row.path.substring(row.path.length - 7)}</div>}
              </div>
              <div className='text-gray-500 text-xs'>
                <span className='mr-4'><Icon icon='hdd' size='sm' className='mr-1' />{numeral(row.bodySize).format('0.0 b')}</span>
                <span className='mr-4'><Icon icon='bars' size='sm' className='mr-1' />{numeral(row.bodyRows).format('0,0a')} rows</span>
                <span className='mr-3'><Icon icon='file' size='sm' className='mr-1' />{row.bodyFormat}</span>
              </div>
            </div>
          )
        } else {
          return <div className='w-full'>--</div>
        }
      }
    },
  ]

  return (
    <ReactDataTable
      columns={columns}
      data={log}
      noHeader
    />
  )
}

export default ActivityList
