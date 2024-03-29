import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import numeral from 'numeral'
import ReactDataTable from 'react-data-table-component'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

import { showModal } from '../app/state/appActions'
import { ModalType } from '../app/state/appState'
import Icon from '../../chrome/Icon'
import DatasetCommitInfo from '../../chrome/DatasetCommitInfo'
import RelativeTimestamp from '../../chrome/RelativeTimestamp'
import UsernameWithIcon from '../../chrome/UsernameWithIcon'
import DropdownMenu from '../../chrome/DropdownMenu'
import { pathToDatasetHeadPreview } from '../dataset/state/datasetPaths'
import RunStatusBadge from '../run/RunStatusBadge'
import { VersionInfo } from '../../qri/versionInfo'
import ManualTriggerButton from '../workflow/ManualTriggerButton'
import DatasetInfoItem from '../dataset/DatasetInfoItem'
import { runEndTime } from '../../utils/runEndTime'
import { trackGoal } from '../../features/analytics/analytics'

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

// column sort function for react-data-table
// defines the actual string to sort on when a sortable column is clicked
const customSort = (rows: VersionInfo[], selector: (row: VersionInfo) => string, direction: 'asc' | 'desc') => {
  // collection-sort-table event
  trackGoal('VXNLJRBH', 0)
  const sorted = rows.sort((a, b) => {
    const aVal = selector(a)
    const bVal = selector(b)
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
export const customSortIcon = (
  <svg
    viewBox="-6 -6 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M22 7.09524L12 17L2 7.09524" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// react-data-table custom styles
export const customStyles = {
  tableWrapper: {
    style: {
      display: 'flex'
    }
  },
  headRow: {
    style: {
      minHeight: '58px',
      paddingRight: '26px',
      paddingLeft: '26px',
      fontSize: 13,
      fontWeight: 'bold'
    }
  },
  headCells: {
    style: {
      fontSize: '1rem', // text-base
      lineHeight: '1.5rem', // text-base
      color: '#000000' // black
    }
  },
  rows: {
    style: {
      minHeight: '58px',
      paddingRight: '26px',
      paddingLeft: '26px'
    }
  },
  expanderCell: {
    style: {
      flex: '0 0 36px'
    }
  }
}

const CollectionTable: React.FC<CollectionTableProps> = ({
  filteredWorkflows,
  simplified = false,
  containerHeight
}) => {
  const dispatch = useDispatch()

  const [ deletedRowInitID, setDeletedRowInitID ] = useState('')

  // react-data-table column definitions
  const columns = [
    {
      name: 'Name',
      selector: (row: VersionInfo) => `${row.username}/${row.name}`,
      sortable: true,
      grow: 1,
      // eslint-disable-next-line react/display-name
      cell: (row: VersionInfo) => (
        <div className='flex items-center truncate group'>

          <div className='truncate'>
            <div className='mb-1'>
              <Link to={pathToDatasetHeadPreview(row)}>
                <UsernameWithIcon username={row.username} name={row.name} className='text-sm font-bold text-black transition-colors group-hover:text-qripink-600 group-hover:underline' />
              </Link>
            </div>
            <div className='flex text-xs items-center overflow-y-hidden'>
              <div className='mr-2 flex-shrink-0' title={row.workflowID && 'This dataset has an automation script'}>
                <Icon icon='automationFilled' size='2xs' className={classNames('text-qrigray-400', {
                  'visible': row.runID,
                  'invisible': !row.runID
                })}/>
              </div>
              <DatasetInfoItem icon='disk' label={numeral(row.bodySize).format('0.0 b')} size='sm' />
              <DatasetInfoItem icon='rows' label={numeral(row.bodyRows).format('0,0a')} size='sm' />
              <DatasetInfoItem icon={'commit'} label={row.commitCount.toString()} size='sm' />
            </div>
          </div>
        </div>
      )
    },
    {
      name: 'Last Update',
      selector: (row: VersionInfo) => row.commitTime,
      sortable: true,
      omit: simplified,
      width: '180px',
      // eslint-disable-next-line react/display-name
      cell: (row: VersionInfo) => {
        const versionLink = `/${row.username}/${row.name}/at${row.path}/history`
        return (
          <Link to={versionLink} className='min-w-0 flex-grow'>
            <DatasetCommitInfo item={row} hover small inRow />
          </Link>
        )
      }
    },
    {
      name: 'Last Run',
      selector: (row: VersionInfo) => row.commitTime,
      omit: simplified,
      sortable: true,
      width: '130px',
      // eslint-disable-next-line react/display-name
      cell: (row: VersionInfo) => {
        // TODO (ramfox): the activity feed expects more content than currently exists
        // in the VersionInfo. Once the backend supplies these values, we can rip
        // out this section that mocks durations & timestamps for us
        const {
          runStatus,
          runStart,
          runDuration,
          runCount
        } = row
        let runEndLabel = <span>-</span>
        if (runStatus !== 'running' && runStart && runDuration) {
          runEndLabel = <RelativeTimestamp timestamp={runEndTime(runStart, runDuration)} />
        }
        // if status is not defined, show nothing in this column
        if (runStatus === undefined) {
          return <>&nbsp;</>
        }
        const runLogLink = `/${row.username}/${row.name}/runs`

        return (
          <Link className='group' to={runLogLink}>
            <div className='flex flex-col'>
              <div className='flex items-center'>
                <div className='text-sm mr-2'>{runStatus === 'running' ? '-' : `#${runCount}`}</div>
                <DatasetInfoItem icon='clock' label={runEndLabel}/>
              </div>
              <div className='text-gray-500 text-xs'>
                <RunStatusBadge status={runStatus}/>
              </div>
            </div>
          </Link>
        )
      }
    },
    // let's hide the Triggers column for now, to provide more room for the name column on narrow screens
    // {
    //   name: 'Triggers',
    //   style: {
    //     flexShrink: 0
    //   },
    //   selector: 'triggers',
    //   omit: simplified,
    //   width: '160px',
    //   cell: (row: VersionInfo) => (row.id
    //       ? <div className='tracking-wider font-medium text-black'>Schedule, Run When, Webhook</div>
    //       : '—'
    //   )
    // },
    {
      name: 'Actions',
      style: {
        flexShrink: 0
      },
      omit: simplified,
      width: '88px',
      // eslint-disable-next-line react/display-name
      cell: (row: VersionInfo) => (
        <div className='mx-auto text-qrigray-400'>
          {row.runID
            ? <ManualTriggerButton row={row}/>
            : '—'}
        </div>
      )
    },
    {
      name: '',
      omit: simplified,
      width: '10px',
      // eslint-disable-next-line react/display-name
      cell: (row: VersionInfo, i: number) => {
        const isLastRow = (i === (filteredWorkflows.length - 1) && filteredWorkflows.length !== 1)
        return (
          <div className='mx-auto text-qrigray-400 flex items-center'>
            <DropdownMenu
              id={row.name}
              icon={<Icon icon='moreVertical' size='sm'/>}
              dropUp={isLastRow}
              oneItem={filteredWorkflows.length === 1}
              items={[
                // {
                //   label: 'Rename...',
                //   disabled: true,
                //   onClick: () => { handleButtonClick("renaming not yet implemented") },
                // },
                // {
                //   label: 'Duplicate...',
                //   disabled: true,
                //   onClick: () => { handleButtonClick("duplicating not yet implemented")},
                // },
                // {
                //   label: 'Export...',
                //   disabled: true,
                //   onClick: () => { handleButtonClick("export not yet implemented")},
                // },
                // {
                //   label: 'Run Now',
                //   disabled: true,
                //   onClick: () => { handleButtonClick("run now not yet implemented")},
                // },
                // {
                //   label: 'Pause Workflow',
                //   disabled: true,
                //   onClick: () => { handleButtonClick("pause not yet implemented")},
                // },
                {
                  label: 'Remove...',
                  onClick: () => {
                    dispatch(
                      showModal(
                        ModalType.removeDataset,
                        {
                          username: row.username,
                          name: row.name,
                          onDsRemove: () => setDeletedRowInitID(row.initID),
                          afterRemove: () => setDeletedRowInitID('')
                        }
                      )
                    )
                  }
                }
              ]}
            />
          </div>
        )
      }
    }
  ]

  const conditionalRowStyles = [
    {
      when: (row: VersionInfo) => row.initID === deletedRowInitID,
      classNames: ['animate-disappear'],
      style: {
        height: 58,
        minHeight: 0,
        overflow: 'hidden'
      }
    }
  ]

  // TODO(chriswhong): implement selectable rows and multi-row actions
  // uncomment `selectableRows` etc below

  return (
    <ReactDataTable
      columns={columns}
      data={filteredWorkflows}
      customStyles={customStyles}
      sortFunction={customSort}
      conditionalRowStyles={conditionalRowStyles}
      highlightOnHover
      pointerOnHover
      fixedHeader
      fixedHeaderScrollHeight={`${String(containerHeight)}px`}
      noHeader
      // selectableRows
      // selectableRowsComponent={forwardRef((props, ref) => (
      //   <Icon icon='checkbox' />
      // ))}
      // onSelectedRowsChange={onSelectedRowsChange}
      // clearSelectedRows={clearSelectedTrigger}
      style={{
        background: 'blue'
      }}
      defaultSortField='name'
      sortIcon={customSortIcon}
    />
  )
}

export default CollectionTable
