import React, { useEffect } from 'react'
import numeral from 'numeral'
import ReactDataTable from 'react-data-table-component'
import ReactTooltip from 'react-tooltip'
import { Link } from 'react-router-dom'

import Icon from '../../chrome/Icon'
import RelativeTimestamp from '../../chrome/RelativeTimestamp'
import DropdownMenu from '../../chrome/DropdownMenu'
import { VersionInfo } from '../../qri/versionInfo'

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

const DatasetsTable: React.FC<DatasetsTableProps> = ({
  filteredDatasets,
  onRowClicked,
  onSelectedRowsChange,
  clearSelectedTrigger
}) => {

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

  const hamburgerItems = [
    {
      onClick: () => { handleButtonClick("renaming not yet implemented") },
      text: 'Rename...'
    },
    {
      onClick: () => { handleButtonClick("duplicating not yet implemented")},
      text: 'Duplicate...'
    },
    {
      onClick: () => { handleButtonClick("export not yet implemented")},
      text: 'Export...'
    },
    {
      onClick: () => { handleButtonClick("run now not yet implemented")},
      text: 'Run Now'
    },
    {
      onClick: () => { handleButtonClick("pause not yet implemented")},
      text: 'Pause Workflow'
    },
    {
      onClick: () => { handleButtonClick("remove")},
      text: 'Remove...'
    }
  ]

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
            <Link to={`/ds/${row.username}/${row.name}`}>{row.username}/{row.name}</Link>
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
        const lastRunOptions = [
          {
            status: 'Success',
            icon: 'check',
            color: 'bg-green-500'
          },
          {
            status: 'Failed',
            icon: 'exclamationCircle',
            color: 'bg-red-600'
          },
          {
            status: 'Running',
            icon: 'spinner',
            color: 'bg-blue-400',
            spin: true
          }
        ]

        const { status, icon, color, spin=false } = lastRunOptions[Math.floor(Math.random() * lastRunOptions.length)]

        return (
          <div className='flex flex-col'>
            <div className='flex items-center mb-2'>
              <div className='font-bold mr-2'>23</div>
              <div className={`inline text-white mr ${color} pl-1 pr-2 rounded rounded-lg flex items-center`}>
                <Icon icon={icon} size='sm' className='mr-1' spin={spin}/> <span className='font-medium text-xs'>{status}</span>
              </div>
            </div>
            <div className='text-gray-500 text-xs'>
              <Icon icon='clock' size='sm'/> <span>45s | 31 minutes ago</span>
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
        return (
          <div className='mx-auto'>
            <DropdownMenu items={hamburgerItems}>
              <Icon icon='ellipsisH' size='lg'/>
            </DropdownMenu>
          </div>
        )
        // return <TableRowHamburger data={row} />
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
