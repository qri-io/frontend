import React from 'react'
import { Link } from 'react-router-dom'
import ReactDataTable from 'react-data-table-component'

import DurationFormat from '../../chrome/DurationFormat'
import RelativeTimestamp from '../../chrome/RelativeTimestamp'
import Icon from '../../chrome/Icon'
import RunStatusBadge from '../run/RunStatusBadge'
import { LogItem } from '../../qri/log'
import { customStyles, customSortIcon } from '../../features/collection/CollectionTable'
import commitishFromPath from '../../utils/commitishFromPath'


interface ActivityListProps {
  log: LogItem[]
  showDatasetName?: boolean
  containerHeight: number
}

const ActivityList: React.FC<ActivityListProps> = ({
  log,
  showDatasetName = true,
  containerHeight
}) => {
  // react-data-table column definitions
  const columns = [
    {
      name: 'Status',
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
      name: 'Time',
      selector: 'start',
      cell: (row: LogItem) => {
        return (
          <div className='text-qrigray-400 flex flex-col text-xs'>
            <div className='mb-1'>
              <RelativeTimestamp timestamp={new Date(row.timestamp)} />
            </div>
            <div className='flex items-center'>
              <Icon icon='clock' size='2xs' className='mr-1' />
              <DurationFormat seconds={Math.ceil(row.runDuration / 1000000000)} />
            </div>
          </div>
        )

      }
    },
    {
      name: 'Commit',
      selector: 'name',
      cell: (row: LogItem) => {
        if (!['failed', 'unchanged'].includes(row.runStatus)) {
          const versionLink = `/ds/${row.username}/${row.name}/at${row.path}/body`
          return (
            <Link to={versionLink}>
              <div className='text-qrinavy font-semibold text-sm flex items-center mb-2'>
                <div className=''>{row.message}</div>
              </div>
              <div className='flex items-center text-xs text-gray-400'>
                <Icon icon='commit' size='sm' className='-ml-2' />
                <div className=''>{commitishFromPath(row.path)}</div>
              </div>
            </Link>
          )
        } else {
          return <div className='w-full'>--</div>
        }
      }
    },
  ]

  // borrows styles and icons from CollectionTable
  return (
    <ReactDataTable
      columns={columns}
      data={log}
      customStyles={customStyles}
      fixedHeader
      fixedHeaderScrollHeight={`${String(containerHeight - 68)}px`}
      noHeader
      style={{
        background: 'blue'
      }}
      defaultSortField='name'
      sortIcon={customSortIcon}
    />
  )
}

export default ActivityList
