import React, { useEffect } from 'react'
import numeral from 'numeral'
import ReactDataTable from 'react-data-table-component'
import ReactTooltip from 'react-tooltip'
import { Link } from 'react-router-dom'

import Icon from '../../chrome/Icon'
import RelativeTimestamp from '../../chrome/RelativeTimestamp'
import ExportButton from '../../chrome/ExportButton'
import { VersionInfo } from '../../qri/versionInfo'
import { pathToWorkflowEditor } from '../dataset/state/datasetPaths'

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

  // react-data-table column definitions
  const columns = [
    {
      name: 'name',
      selector: 'name',
      sortable: true,
      grow: 2,
      cell: (row: VersionInfo) => (
        <div className='p-3'>
          <div className='font-medium text-sm mb-1'>
            <Link to={pathToWorkflowEditor(row.username, row.name)}>{row.username}/{row.name}</Link>
          </div>
          <div className='text-gray-500 text-xs'>
            <span className='mr-4'><Icon icon='hdd' size='sm' className='mr-1' />{numeral(row.bodySize).format('0.0 b')}</span>
            <span className='mr-4'><Icon icon='bars' size='sm' className='mr-1' />{numeral(row.bodyRows).format('0,0a')} rows</span>
            <span className='mr-4'><Icon icon='file' size='sm' className='mr-1' />{row.bodyFormat}</span>
          </div>
        </div>
      )
    },
    {
      name: 'updated',
      selector: 'updated',
      sortable: true,
      width: '120px',
      cell: (row: VersionInfo) => {
        if (row.commitTime) {
          return <RelativeTimestamp timestamp={new Date(row.commitTime)}/>
        } else {
          return '--'
        }
      }
    },
    {
      name: 'status',
      selector: 'status',
      width: '180px',
      // cell: (row: VersionInfo) => <StatusIcons data={row} onClickFolder={onOpenInFinder} /> // eslint-disable-line
      cell: (row: VersionInfo) => <p>todo - status icons</p>
    },
    {
      name: '',
      selector: 'hamburger',
      width: '120px',
      // eslint-disable-next-line react/display-name
      cell: (row: VersionInfo) => {
        return <ExportButton qriRef={row} showIcon={true} size={'md'} />
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
      selectableRows={true}
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
