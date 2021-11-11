import React from 'react'
import { Link } from 'react-router-dom'
import ReactDataTable from 'react-data-table-component'

import DurationFormat from '../../chrome/DurationFormat'
import RelativeTimestamp from '../../chrome/RelativeTimestamp'
import Icon from '../../chrome/Icon'
import DatasetCommitInfo from '../../chrome/DatasetCommitInfo'
import RunStatusBadge from '../run/RunStatusBadge'
import { LogItem } from '../../qri/log'
import { customStyles, customSortIcon } from '../../features/collection/CollectionTable'
import { runEndTime } from '../../utils/runEndTime'
import { NewDataset, NewCommit } from '../../qri/dataset'

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
      selector: (row: LogItem) => row.runStatus,
      width: '200px',
      // eslint-disable-next-line react/display-name
      cell: (row: LogItem) => <RunStatusBadge status={row.runStatus} />
    },
    {
      name: 'name',
      selector: (row: LogItem) => row.name,
      grow: 2,
      omit: !showDatasetName,
      // eslint-disable-next-line react/display-name
      cell: (row: LogItem) => {
        const { username, name } = row
        return (
          <div className='hover:text-qrilightblue hover:underline'>
            <Link to={`/${username}/${name}`}>{username}/{name}</Link>
          </div>
        )
      }
    },
    {
      name: 'Time',
      selector: (row: LogItem) => row.runStart,
      width: '180px',
      // eslint-disable-next-line react/display-name
      cell: (row: LogItem) => {
        const runEnd = runEndTime(row.runStart, row.runDuration)
        return (
          <div className='text-qrigray-400 flex flex-col text-sm'>
            <div className='mb-1'>
              {runEnd ? <RelativeTimestamp timestamp={runEnd} /> : <div className='w-full'>--</div> }
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
      selector: (row: LogItem) => row.commitMessage,
      width: '180px',
      // eslint-disable-next-line react/display-name
      cell: (row: LogItem) => {
        const dataset = NewDataset({
          username: row.username,
          runID: row.runID,
          path: row.path,
          commit: NewCommit({
            title: row.commitTitle,
            timestamp: row.commitTime
          })
        })
        if (!['failed', 'unchanged', 'running'].includes(row.runStatus)) {
          const versionLink = `/${row.username}/${row.name}/at${row.path}/history/body`
          return (
            <Link to={versionLink} className='min-w-0 flex-grow'>
              <DatasetCommitInfo dataset={dataset} small inRow automated/>
            </Link>
          )
        } else {
          return <div className='w-full'>--</div>
        }
      }
    }
  ]

  const conditionalRowStyles = [
    {
      when: (row: LogItem) => row.runStatus === 'running',
      classNames: ['animate-appear', 'overflow-hidden', 'min-height-0-important'],
      style: {
        height: 58
      }
    }
  ]

  // borrows styles and icons from CollectionTable
  return (
    <ReactDataTable
      columns={columns}
      data={log}
      customStyles={customStyles}
      fixedHeader
      conditionalRowStyles={conditionalRowStyles}
      fixedHeaderScrollHeight={`${String(containerHeight)}px`}
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
