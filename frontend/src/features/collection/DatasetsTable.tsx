import React, { useEffect } from 'react'
import numeral from 'numeral'
import ReactDataTable from 'react-data-table-component'
import ReactTooltip from 'react-tooltip'
import { Link } from 'react-router-dom'

import RelativeTimestamp from '../../chrome/RelativeTimestamp'
// import StatusIcons from './StatusIcons'
import ExportButton from '../../chrome/ExportButton'
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

  // react-data-table column definitions
  const columns = [
    {
      name: 'name',
      selector: 'name',
      sortable: true,
      grow: 2,
      cell: (row: VersionInfo) => <Link to={`/ds/${row.username}/${row.name}`}>{row.username}/{row.name}</Link>
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
      name: 'size',
      selector: 'size',
      sortable: true,
      width: '100px',
      cell: (row: VersionInfo) => row.bodySize ? numeral(row.bodySize).format('0.00 b') : '--'
    },
    {
      name: 'rows',
      selector: 'rows',
      sortable: true,
      width: '60px',
      cell: (row: VersionInfo) => row.bodyRows ? numeral(row.bodyRows).format('0a') : '--'
    },
    {
      name: 'status',
      selector: 'status',
      width: '85px',
      // cell: (row: VersionInfo) => <StatusIcons data={row} onClickFolder={onOpenInFinder} /> // eslint-disable-line
      cell: (row: VersionInfo) => <p>todo - status icons</p>
    },
    {
      name: '',
      selector: 'hamburger',
      width: '60px',
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
      fixedHeader
      overflowY
      overflowYOffset='250px'
      highlightOnHover
      pointerOnHover
      onRowClicked={onRowClicked}
      onSelectedRowsChange={onSelectedRowsChange}
      clearSelectedRows={clearSelectedTrigger}
    />
  )
}

export default DatasetsTable
