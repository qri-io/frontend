import React from 'react'
import classNames from 'classnames'
import ContentLoader from "react-content-loader"

import DataType from '../../../chrome/DataType'

interface BodyPreviewTableProps {
  headers?: any[]
  body?: any[]
  loading?: boolean
}

const cellClasses = 'px-2 py-2 overflow-hidden overflow-ellipsis whitespace-nowrap max-w-xs'

const loadingColumns: Array<{ width: number, component: React.ReactElement }> = [
  { width: 26.5, component: <rect y='7' x='8.65' width="6" height="14" rx="1" fill="#D5DADD"/> },
  { width: 185.2, component: <rect y='7' x='8.65' width="104" height="14" rx="1" fill="#D5DADD"/> },
  { width: 163.77, component: <rect y='7' x='8.65' width="17" height="14" rx="1" fill="#D5DADD"/> },
  { width: 113.7, component: <rect y='7' x='8.65' width="22" height="14" rx="1" fill="#D5DADD"/> },
  { width: 98.03, component: <rect y='7' x='8.65' width="35" height="14" rx="1" fill="#D5DADD"/> },
  { width: 124, component: <rect y='7' x='8.65' width="55" height="14" rx="1" fill="#D5DADD"/> },
  { width: 109.19, component: <rect y='7' x='8.65' width="22" height="14" rx="1" fill="#D5DADD"/> },
  { width: 75.13, component: <rect y='7' x='8.65' width="26" height="14" rx="1" fill="#D5DADD"/> }
]

const loadingHeaderColumns: Array<{ width: number, component: React.ReactElement }> = [
  { width: 185.2, component: <rect y='13' x='8.62' width="85" height="14" rx="1" fill="#D5DADD"/> },
  { width: 163.77, component: <rect y='13' x='8.62' width="113" height="14" rx="1" fill="#D5DADD"/> },
  { width: 113.7, component: <rect y='13' x='8.62' width="61" height="14" rx="1" fill="#D5DADD"/> },
  { width: 98.03, component: <rect y='13' x='8.62' width="34" height="14" rx="1" fill="#D5DADD"/> },
  { width: 124, component: <rect y='13' x='8.62' width="42" height="14" rx="1" fill="#D5DADD"/> },
  { width: 109.19, component: <rect y='13' x='8.62' width="57" height="14" rx="1" fill="#D5DADD"/> },
  { width: 75.13, component: <rect y='13' x='8.62' width="43" height="14" rx="1" fill="#D5DADD"/> }
]

export default class BodyPreviewTable extends React.Component<BodyPreviewTableProps> {
  constructor (props: BodyPreviewTableProps) {
    super(props)
    this.state = {
      bodyLength: 0
    }
  }

  handleVerticalScrollThrottled () {}

  render () {
    const { body = [], headers = [], loading = false } = this.props

    const tableRows = loading
      ? Array(20).fill('').map((_, i) => {
        return (
          <tr key={i} className=''>
            {loadingColumns.map((svgComponent, j) => {
              return (
                <td key={j + 1} className='border-r border-b border-qrigray-200'>
                  <ContentLoader width={svgComponent.width} height={28}>
                    {svgComponent.component}
                  </ContentLoader>
                </td>
              )
            })}
          </tr>
        )
      })
      : body.map((row, i) => {
        return (
          <tr key={i} className=''>
            <td key={0}className='bg-white text-center border-r border-b border-qrigray-200'>
              <div className={classNames(cellClasses, 'text-black-500')} style={{ fontSize: 11 }}>
                {
                // TODO (ramfox): when we add back pageInfo/fetching
                // we should use the page number, page size, and the row index (i)
                // to determine the row number
                i + 1
              }
              </div>
            </td>
            {row.map((d: any, j: number) => {
              return (
                <td key={j + 1} className='border-r border-b border-qrigray-200'>
                  <div className={classNames(cellClasses, 'text-qrigray-400')} style={{ fontSize: 11 }}>{typeof d === 'boolean' ? JSON.stringify(d) : d}</div>
                </td>
              )
            })}
          </tr>
        )
      })
    if (!body.length && !loading) return null
    return (
      <div
        id='body-table-container'
        /* setting maxWidth fixes an overflow-x bug affecting parent flex
           containers. Observed on Chrome */
        style={{ maxWidth: 800 }}
        onScroll={() => { this.handleVerticalScrollThrottled() } }
      >
        <table className='table text-xs border-separate border-l border-qrigray-200 mb-4 ' style={{ borderSpacing: 0 }}>
          <thead className='sticky top-0'>
            <tr>
              <th className=' h-6 bg-white p-0 border-t border-r border-b border-qrigray-200'>
                <div className={classNames(cellClasses, 'leading-4')}>&nbsp;</div>
              </th>
              {loading
                ? loadingHeaderColumns.map((svgComponent, j) => {
                  return (
                    <th key={j} className=' h-6 bg-white font-medium text-left p-0 p-0 border-t border-r border-b border-qrigray-200'>
                      <ContentLoader width={svgComponent.width} height={38}>
                        {svgComponent.component}
                      </ContentLoader>
                    </th>
                  )
                })
                : headers && headers.map((d: any, j: number) => {
                  return (
                    <th key={j} className=' h-6 bg-white font-medium text-left p-0 p-0 border-t border-r border-b border-qrigray-200'>
                      <div className={classNames(cellClasses, 'text-black text-sm flex items-center')} >
                        <DataType type={d.type} showLabel={false} className='mr-1 text-qrigray-300' />
                        <div>{d.title}</div>
                      </div>
                    </th>
                  )
                })
              }
            </tr>
          </thead>
          <tbody>
            {tableRows}
          </tbody>
        </table>
      </div>
    )
  }
}
