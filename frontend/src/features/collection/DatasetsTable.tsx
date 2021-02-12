import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import numeral from 'numeral'
import ReactDataTable from 'react-data-table-component'
import ReactTooltip from 'react-tooltip'
import { Link } from 'react-router-dom'

import { showModal } from '../app/state/appActions'
import { ModalType } from '../app/state/appState'
import Icon from '../../chrome/Icon'
import DurationFormat from '../../chrome/DurationFormat'
import RelativeTimestamp from '../../chrome/RelativeTimestamp'
import DropdownMenu, { DropDownMenuItem } from '../../chrome/DropdownMenu'
import { VersionInfo } from '../../qri/versionInfo'
import { pathToWorkflowEditor } from '../dataset/state/datasetPaths'
import RunStatusBadge from '../run/RunStatusBadge'
import { LogItem } from '../../qri/log';

// TODO (ramfox): this data helps us mock the expected log response from the backend
// when a log contains run information, then we can remove this
import activity from '../activityFeed/stories/data/activityLog.json'
// helper function to have the `activity` be accepted as a `LogItem[]`
function convertToLogItemList(list: any[]): LogItem[] {
  return list as LogItem[]
}
const runActivities = convertToLogItemList(activity)

interface DatasetsTableProps {
  filteredDatasets: VersionInfo[]
  // When the clearSelectedTrigger changes value, it triggers the ReactDataTable
  // to its internal the selections
  clearSelectedTrigger: boolean
  onRowClicked: (row: VersionInfo) => void
  onSelectedRowsChange: ({ selectedRows }: { selectedRows: VersionInfo[] }) => void
}

// fieldValue returns a VersionInfo value for a given field argument
const fieldValue = (row: VersionInfo, field: string) => {
  switch (field) {
    case 'name':
      return `${row['username']}/${row['name']}`
    case 'updated':
      return row.commitTime
    case 'size':
      return row.bodySize
    case 'rows':
      return row.bodyRows
    default:
      return (row as Record<string,any>)[field]
  }
}
// column sort function for react-data-table
// defines the actual string to sort on when a sortable column is clicked
const customSort = (rows: VersionInfo[], field: string, direction: 'asc' | 'desc') => {
  return rows.sort((a, b) => {
    const aVal = fieldValue(a, field)
    const bVal = fieldValue(b, field)
    if (aVal === bVal) {
      return 0
    } else if (aVal < bVal) {
      return (direction === 'asc') ? -1 : 1
    }
    return (direction === 'asc') ? 1 : -1
  })
}

const statusIcons = [
  {
    id: 'deployed',
    icon: 'playCircle',
    color: 'text-qriblue'
  },
  {
    id: 'paused',
    icon: 'pauseCircle',
    color: 'text-gray-300'
  },
  {
    id: 'notDeployed',
    icon: 'circle',
    color: 'text-gray-300'
  },
]

const DatasetsTable: React.FC<DatasetsTableProps> = ({
  filteredDatasets,
  onRowClicked,
  onSelectedRowsChange,
  clearSelectedTrigger
}) => {

  const dispatch = useDispatch()

  // rebuild tooltips on mount and update
  useEffect(() => {
    ReactTooltip.rebuild()
  })

  // react-data-table custom styles
  const customStyles = {
    headRow: {
      style: {
        minHeight: '38px'
      }
    },
    rows: {
      style: {
        minHeight: '38px'
      }
    }
  }

  const handleButtonClick = (message: string) => {
    alert(message)
  }

  // react-data-table column definitions
  const columns = [
    {
      selector: 'status',
      sortable: true,
      width: '48px',
      style: {
        paddingRight: 0
      },
      cell: (row: VersionInfo) => {

        // TODO (ramfox): when we get actual data back from the backend
        // remove this in favor of pulling the type of dataset from the VersionInfo
        const { icon, color } = statusIcons[Math.floor(Math.random() * statusIcons.length)]

        return (
          <div className={`mx-auto ${color}`} style={{ fontSize: '1.5rem' }} >
            <Icon icon={icon} />
          </div>
        )
      }
    },
    {
      name: 'name',
      selector: 'name',
      sortable: true,
      grow: 2,
      cell: (row: VersionInfo) => (
        <div className='py-3'>
          <div className='font-medium text-sm mb-1'>
            <Link to={pathToWorkflowEditor(row.username, row.name)}>{row.username}/{row.name}</Link>
          </div>
          <div className='text-gray-500 text-xs'>
            <span className='mr-3'><Icon icon='hdd' size='sm' className='mr-1' />{numeral(row.bodySize).format('0.0 b')}</span>
            <span className='mr-3'><Icon icon='bars' size='sm' className='mr-1' />{numeral(row.bodyRows).format('0,0a')} rows</span>
            <span className='mr-3'><Icon icon='file' size='sm' className='mr-1' />{row.bodyFormat}</span>
            {row.commitTime && (
              <span className='mr-3'><Icon icon='clock' size='sm' className='mr-1' /><RelativeTimestamp timestamp={new Date(row.commitTime)}/></span>
            )}

          </div>
        </div>
      )
    },
    {
      name: 'last run',
      selector: 'lastrun',
      grow: 1,
      sortable: true,
      cell: (row: VersionInfo) => {

        // TODO (ramfox): the activity feed expects more content than currently exists
        // in the VersionInfo. Once the backend supplies these values, we can rip
        // out this section that mocks durations & timestamps for us
        const {
          runStatus,
          runDuration,
          timestamp
        } = runActivities[Math.floor(Math.random() * runActivities.length)]

        return (
          <div className='flex flex-col'>
            <div className='flex items-center mb-2'>
              <div className='font-bold mr-2'>23</div>
              <RunStatusBadge status={runStatus} small />
            </div>
            <div className='text-gray-500 text-xs'>
              <Icon icon='clock' size='sm'/> <span><DurationFormat seconds={runDuration} /> | <RelativeTimestamp timestamp={new Date(timestamp)}/></span>
            </div>
          </div>
        )
      }
    },
    {
      name: '',
      selector: 'hamburger',
      width: '120px',
      // eslint-disable-next-line react/display-name
      cell: (row: VersionInfo) => {
        const hamburgerItems: DropDownMenuItem[] = [
          {
            onClick: () => { handleButtonClick("renaming not yet implemented") },
            text: 'Rename...',
            disabled: true
          },
          {
            onClick: () => { handleButtonClick("duplicating not yet implemented")},
            text: 'Duplicate...',
            disabled: true
          },
          {
            onClick: () => { handleButtonClick("export not yet implemented")},
            text: 'Export...',
            disabled: true
          },
          {
            onClick: () => { handleButtonClick("run now not yet implemented")},
            text: 'Run Now',
            disabled: true
          },
          {
            onClick: () => { handleButtonClick("pause not yet implemented")},
            text: 'Pause Workflow',
            disabled: true
          },
          {
            onClick: () => {
              dispatch(
                showModal(
                  ModalType.removeDataset,
                  {
                    username: row.username,
                    name: row.name
                  }
                )
              )
            },
            text: 'Remove...'
          }
        ]
        return (
          <div className='mx-auto'>
            <DropdownMenu items={hamburgerItems}>
              <Icon icon='ellipsisH' size='lg'/>
            </DropdownMenu>
          </div>
        )
      }
    }
  ]

  return (
    <ReactDataTable
      columns={columns}
      data={filteredDatasets}
      customStyles={customStyles}
      sortFunction={customSort}
      highlightOnHover
      pointerOnHover
      noHeader
      onRowClicked={onRowClicked}
      onSelectedRowsChange={onSelectedRowsChange}
      clearSelectedRows={clearSelectedTrigger}
    />
  )
}

export default DatasetsTable
