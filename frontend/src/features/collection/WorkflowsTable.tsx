import React from 'react'
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
import { WorkflowInfo } from '../../qrimatic/workflow';
import ManualTriggerButton from '../manualTrigger/ManualTriggerButton';
import DatasetInfoItem from '../../chrome/DatasetInfoItem'

interface WorkflowsTableProps {
  filteredWorkflows: WorkflowInfo[]
  // When the clearSelectedTrigger changes value, it triggers the ReactDataTable
  // to its internal the selections
  clearSelectedTrigger: boolean
  onSelectedRowsChange: ({ selectedRows }: { selectedRows: WorkflowInfo[] }) => void
  // simplified: true will hide a number of "verbose" columns in the table
  simplified?: boolean
  containerHeight: number
}

// fieldValue returns a WorkflowInfo value for a given field argument
const fieldValue = (row: WorkflowInfo, field: string) => {
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
const customSort = (rows: WorkflowInfo[], field: string, direction: 'asc' | 'desc') => {
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

const WorkflowsTable: React.FC<WorkflowsTableProps> = ({
  filteredWorkflows,
  onRowClicked,
  onSelectedRowsChange,
  clearSelectedTrigger,
  simplified=false,
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
      cell: (row: WorkflowInfo) => (
        <div className='flex items-center truncate'>
          <div className='w-8 mr-2'>
            <Icon icon='automationFilled' className='text-qrigreen' />
          </div>
          <div className='truncate'>
            <div className='mb-1'>
              <Link to={pathToDatasetPreview(row)}>
                <UsernameWithIcon username={`${row.username}/${row.name}`}  className='text-sm font-medium text-qrinavy ' />
              </Link>
            </div>
            <div className='flex text-xs overflow-y-hidden'>
              <DatasetInfoItem icon='disk' text={numeral(row.bodySize).format('0.0 b')} />
              <DatasetInfoItem icon='rows' text={numeral(row.bodyRows).format('0,0a')} />
              <DatasetInfoItem icon='page' text={row.bodyFormat} />
              {row.commitTime && (
                <DatasetInfoItem icon='clock' text={<RelativeTimestamp timestamp={new Date(row.commitTime)}/>} />
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
      cell: (row: WorkflowInfo) => {

        // TODO (ramfox): the activity feed expects more content than currently exists
        // in the WorkflowInfo. Once the backend supplies these values, we can rip
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
              <DatasetInfoItem icon='clock' text={<RelativeTimestamp timestamp={new Date(commitTime || '')}/>} />
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
      cell: (row: WorkflowInfo) => (
        <div className='tracking-wider font-medium text-qrinavy'>Schedule, Run When, Webhook</div>
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
      cell: (row: WorkflowInfo) => (row.id
          ? <ManualTriggerButton workflowID={row.id} />
          : '--'
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
      cell: (row: WorkflowInfo) => {
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
      selectableRowsComponent={() => <Icon icon='checkbox' />}
      onSelectedRowsChange={onSelectedRowsChange}
      clearSelectedRows={clearSelectedTrigger}
      style={{
        background: 'blue'
      }}
    />
  )
}

export default WorkflowsTable
