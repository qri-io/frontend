import React, { useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { InfiniteLoader, Grid, MultiGrid, IndexRange } from 'react-virtualized'
import ContentLoader from 'react-content-loader'
import classNames from 'classnames'
import useDimensions from 'react-use-dimensions'
import 'react-virtualized/styles.css'

import { QriRef } from '../../../qri/ref'
import DataType from '../../../chrome/DataType'
import { DEFAULT_BODY_PAGE_SIZE, loadBody } from '../../../features/dataset/state/datasetActions'
import { selectDatasetVirtualizedBody } from '../../../features/dataset/state/datasetState'
interface BodyTableProps {
  rowCount: number
  headers?: any[]
  qriRef: QriRef
  loading?: boolean
}

const cellClasses = 'px-2 py-2 overflow-hidden overflow-ellipsis whitespace-nowrap max-w-xs'

const loadingColumns: Array<{ width: number, component: React.ReactElement }> = [
  { width: 168, component: <rect y='1' x='0' width="6" height="15" rx="1" fill="#D5DADD"/> },
  { width: 185.2, component: <rect y='1' x='0' width="104" height="15" rx="1" fill="#D5DADD"/> },
  { width: 163.77, component: <rect y='1' x='0' width="17" height="15" rx="1" fill="#D5DADD"/> },
  { width: 113.7, component: <rect y='1' x='0' width="22" height="15" rx="1" fill="#D5DADD"/> },
  { width: 98.03, component: <rect y='1' x='0' width="35" height="15" rx="1" fill="#D5DADD"/> },
  { width: 124, component: <rect y='1' x='0' width="55" height="15" rx="1" fill="#D5DADD"/> },
  { width: 109.19, component: <rect y='1' x='0' width="22" height="15" rx="1" fill="#D5DADD"/> }
]

const loadingHeaderColumns: Array<{ width: number, component: React.ReactElement }> = [
  { width: 185.2, component: <rect y='1' x='8.62' width="85" height="15" rx="1" fill="#D5DADD"/> },
  { width: 163.77, component: <rect y='1' x='8.62' width="113" height="15" rx="1" fill="#D5DADD"/> },
  { width: 113.7, component: <rect y='1' x='8.62' width="61" height="15" rx="1" fill="#D5DADD"/> },
  { width: 98.03, component: <rect y='1' x='8.62' width="34" height="15" rx="1" fill="#D5DADD"/> },
  { width: 124, component: <rect y='1' x='8.62' width="42" height="15" rx="1" fill="#D5DADD"/> },
  { width: 109.19, component: <rect y='1' x='8.62' width="57" height="15" rx="1" fill="#D5DADD"/> },
  { width: 75.13, component: <rect y='1' x='8.62' width="43" height="15" rx="1" fill="#D5DADD"/> }
]

const BodyTable: React.FC<BodyTableProps> = ({
  rowCount,
  headers = [],
  qriRef,
  loading = false
}) => {
  const dispatch = useDispatch()
  const list = useSelector(selectDatasetVirtualizedBody)
  const [tableContainer, {
    height: tableContainerHeight,
    width: tableContainerWidth
  }] = useDimensions()

  const timeoutRef: { current: number } = useRef(0)

  const isRowLoaded = ({ index }: any) => {
    return list ? !!list[index] : false
  }

  const loadMoreRows = async ({ startIndex, stopIndex }: any) => {
    clearTimeout(timeoutRef.current)
    return await new Promise<void>(() => {
      // debounce this function so user can scroll way down the table and not trigger hundreds of API calls
      timeoutRef.current = window.setTimeout(() => {
        const offset = parseInt(stopIndex) - DEFAULT_BODY_PAGE_SIZE + 1
        dispatch(loadBody(qriRef, offset))
      }, 300)
    })
  }

  const cellLoadingContent = (columnIndex: number) => {
    // instead of using a random number, derive the loader to use from the column
    // this prevents a "flash" that was happening when the loading cells would re-render with a different loader
    const loaderIndex = columnIndex % loadingColumns.length
    return (
      <div className={cellClasses}>
        <ContentLoader width={loadingColumns[loaderIndex].width} height={16}>
          {loadingColumns[columnIndex].component}
        </ContentLoader>
      </div>
    )
  }

  interface CellRenderer {
    columnIndex: number
    key: string
    rowIndex: number
    style: object
  }

  const cellRenderer = ({ columnIndex, key, rowIndex, style }: CellRenderer) => {
    let content
    // handle cells in the header row
    if (rowIndex === 0) {
      // no content for the first column
      if (columnIndex > 0) {
        if (loading) {
          // loading state
          const svgComponent = loadingHeaderColumns[columnIndex - 1]
          content = (
            <ContentLoader width={svgComponent.width} height={16}>
              {svgComponent.component}
            </ContentLoader>
          )
        } else {
          // show column header
          content = (
            <>
              <DataType type={headers[columnIndex - 1].type} showLabel={false} className='mr-1 text-qrigray-300' />
              <div>{headers[columnIndex - 1].title}</div>
            </>
          )
        }
      }

      return (
        <div key={key} className='border-r border-b border-t border-qrigray-200 flex-grow-0 flex-shrink-0 font-medium' style={style}>
          <div className={classNames(cellClasses, 'text-black text-sm flex items-center')}>
            {content}
          </div>
        </div>
      )
    }

    // always show the row number in the first column
    if (columnIndex === 0) {
      content = (
        <div className={classNames(cellClasses, 'text-black-500')} style={{ fontSize: 11 }}>{rowIndex}</div>
      )
    } else {
      // handle cells in normal rows
      if (loading) {
        // loading state
        content = cellLoadingContent(columnIndex)
      } else {
        const row = list && list[rowIndex - 1]
        if (row) {
          content = (
            <div className={classNames(cellClasses, 'text-qrigray-400')} style={{ fontSize: 11 }} title={`${row[columnIndex - 1]}`}>{row[columnIndex - 1]}</div>
          )
        } else {
          content = cellLoadingContent(columnIndex)
        }
      }
    }

    return (
      <div key={key} className='border-r border-b border-qrigray-200 flex-grow-0 flex-shrink-0' style={style}>
        {content}
      </div>
    )
  }

  const createOnSectionRendered = (onRowsRendered: (params: IndexRange) => void) => {
    return function ({ rowStartIndex, rowStopIndex }: { rowStartIndex: number, rowStopIndex: number }) {
      return onRowsRendered({ startIndex: rowStartIndex, stopIndex: rowStopIndex })
    }
  }

  const getColumnWidth = ({ index }: { index: number }) => {
    return index === 0 ? 75 : 175
  }

  return (
    <div className='text-xs border-separate border-l border-qrigray-200 h-full flex flex-col overflow-hidden min-h-0' style={{ borderSpacing: 0 }}>
      <div ref={tableContainer} className='flex-grow min-h-0'>
        {loading
          ? <Grid
           cellRenderer={cellRenderer}
           columnCount={7}
           columnWidth={getColumnWidth}
           height={tableContainerHeight || 0}
           rowCount={100}
           rowHeight={32}
           width={tableContainerWidth || 0}
         />
          : <InfiniteLoader
           isRowLoaded={isRowLoaded}
           loadMoreRows={loadMoreRows}
           minimumBatchSize={DEFAULT_BODY_PAGE_SIZE}
           rowCount={rowCount + 1}>
            {({ onRowsRendered, registerChild }) => (
              <MultiGrid
               ref={registerChild}
               fixedRowCount={1}
               fixedColumnCount={1}
               enableFixedRowScroll
               enableFixedColumnScroll
               classNameBottomLeftGrid='hide-scrollbar'
               classNameTopRightGrid='hide-scrollbar'
               cellRenderer={cellRenderer}
               columnCount={headers.length + 1}
               columnWidth={getColumnWidth}
               height={tableContainerHeight}
               rowCount={rowCount + 1}
               rowHeight={32}
               width={tableContainerWidth}
               onSectionRendered={createOnSectionRendered(onRowsRendered)}
             />
            )}
          </InfiniteLoader>
        }
      </div>
    </div>
  )
}

export default BodyTable
