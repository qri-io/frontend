import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import queryString from 'query-string'

import { loadSearchResults } from './state/searchActions'
import { selectSearchResults, selectSearchPageInfo } from './state/searchState'
import NavBar from '../navbar/NavBar';
import BigSearchBox from './BigSearchBox';
import PageControl, { PageChangeObject } from '../../chrome/PageControl'
import Footer from '../footer/Footer'
import { NewSearchParams } from '../../qri/search'
import DatasetList from '../../chrome/DatasetList'
import ContentBox from '../../chrome/ContentBox'
import Icon from '../../chrome/Icon'
import DropdownMenu from '../../chrome/DropdownMenu'
import { CleanSearchParams } from '../../qri/search'

const Search: React.FC<{}> = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { search } = useLocation()

  const scrollContainer = useRef<HTMLDivElement>(null)

  // get search results and accompanying pageInfo from the store
  const searchResults = useSelector(selectSearchResults)
  const pageInfo = useSelector(selectSearchPageInfo)

  const searchParams = NewSearchParams(queryString.parse(search))
  const { q, page, sort } = searchParams

  // if the query string ever changes, fetch new data
  useEffect(() => {
    dispatch(loadSearchResults(searchParams))
  }, [q, page, sort, dispatch])

  // handle new search term input
  const handleSearchSubmit = (newQ:string) => {
    updateQueryParams({ q: newQ })
  }

  // handle page change from PageControl
  const handlePageChange = ({ selected: pageIndex }: PageChangeObject) => {
    updateQueryParams({ page: pageIndex + 1 })
  }

  // merges new query params with existing params, updates history
  const updateQueryParams = (newQueryParams: Record<string, any>) => {
    const newParams = {
      ...searchParams,
      ...newQueryParams
    }

    // reset page if sort has changed
    if (newParams.sort !== searchParams.sort) {
      newParams.page = 1
    }

    // reset page if q has changed
    if (newParams.q !== searchParams.q) {
      newParams.page = 1
    }

    // scroll to top if page has changed
    if (scrollContainer.current && (newParams.page !== searchParams.page)) {
      scrollContainer.current.scrollTop = 0
    }

    // build a params object excluding undefined or default params, so they don't show up in the URL
    const newParamsObject = new URLSearchParams()
    const cleanParams: Record<string, any> = CleanSearchParams(newParams)
    Object.keys(cleanParams).forEach((key) => {
      newParamsObject.append(key, cleanParams[key])
    })

    // update the URL
    history.push({ search: newParamsObject.toString() })
  }

  const menuItems = [
    {
      text: 'Dataset Name',
      active: sort === 'name',
      onClick: () => { updateQueryParams({ sort: 'name' }) }
    },
    {
      text: 'Recently Updated',
      active: sort === 'recentlyupdated',
      onClick: () => { updateQueryParams({ sort: 'recentlyupdated' }) }
    }
  ]

  return (
    <div className='flex flex-col h-full w-full overflow-y-scroll' ref={scrollContainer} style={{ backgroundColor: '#f3f4f6'}}>
      <NavBar showSearch={false} />
      <div className='flex-grow w-full py-9'>
        <div className='w-4/5 max-w-screen-lg mx-auto mb-10'>
          <div className='flex items-center'>
            <div className='flex-grow'>
              <div className='text-qrinavy text-3xl font-black mb-2'>Dataset Search</div>
              <div className='text-qrigray-400 text-sm mb-4'>{pageInfo.resultCount} datasets found matching '{q}'</div>
            </div>
            <DropdownMenu items={menuItems} className='ml-8'>
              <div className='border border-qrigray-300 rounded-lg text-qrigray-400 text-xs font-normal px-2 py-2 cursor-pointer'>
                Sort By
                <Icon icon='caretDown' size='2xs' className='ml-3' />
              </div>
            </DropdownMenu>
          </div>
          <BigSearchBox onSubmit={handleSearchSubmit} value={q}/>
        </div>
        <div className='w-4/5 max-w-screen-lg mx-auto'>
          {
            (searchResults.length > 0) ?
            <>
              <ContentBox className='mb-6'>
                <DatasetList
                  datasets={searchResults}
                />
              </ContentBox>
              <PageControl
                pageInfo={pageInfo}
                queryParams={CleanSearchParams(searchParams)}
                onPageChange={handlePageChange}
              />
            </> : (
              <div className='text-center'>No results found for '{q}'</div>
            )
          }
        </div>
      </div>
      <div className='bg-white flex-shrink-0'>
        <Footer />
      </div>
    </div>
  )
}

export default Search;
