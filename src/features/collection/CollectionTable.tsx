 import React, { forwardRef } from 'react'
import { useDispatch } from 'react-redux';
import numeral from 'numeral'
import ReactDataTable from 'react-data-table-component'
import { Link } from 'react-router-dom'

import { showModal } from '../app/state/appActions'
import { ModalType } from '../app/state/appState'
import Icon from '../../chrome/Icon'
import RelativeTimestamp from '../../chrome/RelativeTimestamp'
import UsernameWithIcon from '../../chrome/UsernameWithIcon'
import DropdownMenu, { DropDownMenuItem } from '../../chrome/DropdownMenu'
import { pathToDatasetPreview } from '../dataset/state/datasetPaths'
import RunStatusBadge from '../run/RunStatusBadge'
import { VersionInfo } from '../../qri/versionInfo';
import ManualTriggerButton from '../manualTrigger/ManualTriggerButton';
import DatasetInfoItem from '../dataset/DatasetInfoItem'

interface CollectionTableProps {
  filteredWorkflows: VersionInfo[]
  // When the clearSelectedTrigger changes value, it triggers the ReactDataTable
  // to its internal the selections
  clearSelectedTrigger: boolean
  onSelectedRowsChange: ({ selectedRows }: { selectedRows: VersionInfo[] }) => void
  // simplified: true will hide a number of "verbose" columns in the table
  simplified?: boolean
  containerHeight: number
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
  const sorted = rows.sort((a, b) => {
    const aVal = fieldValue(a, field)
    const bVal = fieldValue(b, field)
    if (aVal === bVal) {
      return 0
    } else if (aVal < bVal) {
      return (direction === 'asc') ? -1 : 1
    }
    return (direction === 'asc') ? 1 : -1
  })

  // custom sort functions in react-data-table-component must return a new array
  return sorted.slice(0)
}

// based on 'caretDown' but needs a custom viewbox and a custom css rule in App.css to show properly in react-data-table
const customSortIcon = (
  <svg
    viewBox="-6 -6 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M22 7.09524L12 17L2 7.09524" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// react-data-table custom styles
const customStyles = {
  table: {
    style: {
      paddingRight: '26px',
      paddingLeft: '26px'
    },
  },
  tableWrapper: {
    style: {
      display: 'flex'
    },
  },
  headRow: {
    style: {
      minHeight: '68px'
    }
  },
  headCells: {
    style: {
      fontSize: '1rem', // text-base
      lineHeight: '1.5rem', // text-base
      color: '#1B3356' // qrinavy
    },
  },
  rows: {
    style: {
      minHeight: '68px'
    }
  },
  expanderCell: {
    style: {
      flex: '0 0 36px',
    },
  },
}

const CollectionTable: React.FC<CollectionTableProps> = ({
  filteredWorkflows,
  onSelectedRowsChange,
  clearSelectedTrigger,
  simplified = false,
  containerHeight
}) => {
  const dispatch = useDispatch()

  const handleButtonClick = (message: string) => {
    alert(message)
  }

  // react-data-table column definitions
  const columns = [
    {
      name: 'Name',
      selector: 'name',
      sortable: true,
      grow: 1,
      cell: (row: VersionInfo) => (
        <div className='flex items-center truncate'>
          <div className='w-8 mr-2'>
            {row.workflowID
              ? <Icon icon='automationFilled' className='text-qrigreen' />
              : <Icon icon='automationFilled' className='text-gray' />
            }
          </div>
          <div className='truncate'>
            <div className='mb-1'>
              <Link to={pathToDatasetPreview(row)}>
                <UsernameWithIcon username={`${row.username}/${row.name}`}  className='text-sm font-medium text-qrinavy ' />
              </Link>
            </div>
            <div className='flex text-xs overflow-y-hidden'>
              <DatasetInfoItem icon='disk' label={numeral(row.bodySize).format('0.0 b')} small />
              <DatasetInfoItem icon='rows' label={numeral(row.bodyRows).format('0,0a')} small />
              <DatasetInfoItem icon='page' label={row.bodyFormat} small />
              {row.commitTime && (
                <DatasetInfoItem icon='clock' label={<RelativeTimestamp timestamp={new Date(row.commitTime)}/>} small />
              )}
            </div>
          </div>
        </div>
      )
    },
    {
      name: 'Last Run',
      selector: 'lastrun',
      omit: simplified,
      width: '180px',
      sortable: true,
      cell: (row: VersionInfo) => {

        // TODO (ramfox): the activity feed expects more content than currently exists
        // in the VersionInfo. Once the backend supplies these values, we can rip
        // out this section that mocks durations & timestamps for us
        const {
          status,
          commitTime
        } = row

        // if status is not defined, show nothing in this column
        if (status === undefined) {
          return <>&nbsp;</>
        }

        return (
          <div className='flex flex-col'>
            <div className='flex items-center'>
              <div className='text-sm mr-2'>#23</div>
              <DatasetInfoItem icon='clock' label={<RelativeTimestamp timestamp={new Date(commitTime || '')}/>} />
            </div>
            <div className='text-gray-500 text-xs'>
              <RunStatusBadge status={status}/>
            </div>
          </div>
        )
      }
    },
    {
      name: 'Triggers',
      style: {
        flexShrink: 0
      },
      selector: 'triggers',
      omit: simplified,
      width: '160px',
      cell: (row: VersionInfo) => (row.id
          ? <div className='tracking-wider font-medium text-qrinavy'>Schedule, Run When, Webhook</div>
          : '—'
      )
    },
    {
      name: 'Actions',
      style: {
        flexShrink: 0
      },
      selector: 'actions',
      omit: simplified,
      width: '90px',
      cell: (row: VersionInfo) => (row.id
          ? <ManualTriggerButton workflowID={row.id} />
          : '—'
      )
    },
    {
      name: '',
      style: {
        flexShrink: 0
      },
      selector: 'hamburger',
      omit: simplified,
      width: '60px',
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
          <div className='mx-auto text-gray-500'>
            <DropdownMenu items={hamburgerItems}>
              <Icon icon='ellipsisH' size='md'/>
            </DropdownMenu>
          </div>
        )
      }
    }
  ]

  return (
    <ReactDataTable
      columns={columns}
      data={filteredWorkflows}
      customStyles={customStyles}
      sortFunction={customSort}
      highlightOnHover
      pointerOnHover
      fixedHeader
      fixedHeaderScrollHeight={`${String(containerHeight - 68)}px`}
      noHeader
      selectableRows
      selectableRowsComponent={forwardRef((props, ref) => (
        <Icon icon='checkbox' />
      ))}
      onSelectedRowsChange={onSelectedRowsChange}
      clearSelectedRows={clearSelectedTrigger}
      style={{
        background: 'blue'
      }}
      defaultSortField='name'
      sortIcon={customSortIcon}
    />
  )
}

export default CollectionTable