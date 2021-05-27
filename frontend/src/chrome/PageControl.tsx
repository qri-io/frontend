import React from 'react'
import numeral from 'numeral'
import ReactPaginate from 'react-paginate'
import querystring from 'querystring'

import Icon from '../chrome/Icon'

import { QueryParams } from '../qri/queryParams'


export interface PageInfo {
  resultCount: number
  page: number
  pageSize: number
}

export interface PageChangeObject {
  selected: number
}

interface PageControlProps {
  pageInfo: PageInfo
  queryParams: QueryParams
  showRange?: boolean
  onPageChange: (o:PageChangeObject) => void
}

// pass in pageInfo prop to show pagination info and controls
const PageControl: React.FC<PageControlProps> = ({
  pageInfo,
  queryParams,
  showRange = true,
  onPageChange
}) => {
  const { resultCount, page, pageSize } = pageInfo

  const pageCount = Math.ceil(resultCount / pageSize)

  // calculate item range from page, pageSize
  const lowItem = ((page - 1) * pageSize) + 1
  let highItem = lowItem + pageSize - 1

  // handle last page
  if (highItem > resultCount) {
    highItem = resultCount
  }

  const hrefBuilder = (pageNumber: number) => {
    const queryParamString = querystring.stringify({
      ...queryParams,
      page: pageNumber
    })
    return `?${queryParamString}`
  }

  return (
    <div className='page-control flex justify-between px-6 text-qrigray'>
      { showRange && <div className='current-page-info flex items-center'>{numeral(lowItem).format('0,0')}-{numeral(highItem).format('0,0')} of {numeral(resultCount).format('0,0')}</div> }
      { pageCount > 1 && (
        <div className='text-right'>
          <ReactPaginate
            pageCount={pageCount}
            pageRangeDisplayed={5}
            marginPagesDisplayed={2}
            pageClassName='bg-white p-3 font-semibold rounded-sm m-1 leading-3'
            previousClassName='flex items-center mr-1'
            previousLinkClassName='flex items-center'
            nextClassName='flex items-center ml-1'
            nextLinkClassName='flex items-center'
            forcePage={page - 1}
            previousLabel={<Icon icon='caretLeft' size='xs' />}
            nextLabel={<Icon icon='caretRight' size='xs' />}
            hrefBuilder={hrefBuilder}
            activeClassName='text-qrired'
            onPageChange={onPageChange}
            containerClassName='page-control-pagination flex items-center'
          />
        </div>
      )}
    </div>
  )
}

export default PageControl
