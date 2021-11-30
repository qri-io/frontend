import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import queryString from 'query-string'
import ContentLoader from 'react-content-loader'

import { loadSearchResults } from './state/searchActions'
import {
  selectSearchResults,
  selectSearchPageInfo,
  selectSearchLoading
} from './state/searchState'
import SearchBox from './SearchBox'
import PageControl, { PageChangeObject } from '../../chrome/PageControl'
import ScrollLayout from '../layouts/ScrollLayout'
import { NewSearchParams, CleanSearchParams } from '../../qri/search'
import DatasetList from '../../chrome/DatasetList'
import Link from '../../chrome/Link'
import Icon from '../../chrome/Icon'
import DropdownMenu from '../../chrome/DropdownMenu'
import Head from '../app/Head'

import { trackGoal } from '../../features/analytics/analytics'

const Search: React.FC<{}> = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { search } = useLocation()

  const scrollContainer = useRef<HTMLDivElement>(null)

  // get search results and accompanying pageInfo from the store
  const searchResults = useSelector(selectSearchResults)
  const pageInfo = useSelector(selectSearchPageInfo)
  const loading = useSelector(selectSearchLoading)

  const searchParams = NewSearchParams(queryString.parse(search))
  const { q, page, sort } = searchParams

  // if the query string ever changes, fetch new data
  useEffect(() => {
    dispatch(loadSearchResults(searchParams))
  }, [q, page, sort])

  // handle new search term input
  const handleSearchSubmit = (newQ: string) => {
    // search-submit-search-string event
    trackGoal('WYBS8MYM', 0)
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

  // shown if user lands on /search with no query params
  let resultsContent = (
    <div className='text-center font-semibold text-sm'>
      <span className='text-qrigray-400 mr-4'>Try:</span>
      <Link to='/search?q=transportation' className='mr-6'>transportation</Link>
      <Link to='/search?q=census' className='mr-6'>census</Link>
      <Link to='/search?q=covid-19'>covid-19</Link>
    </div>
  )

  if (q) {
    if (searchResults.length > 0) {
      resultsContent = (
        <>
          <DatasetList
            datasets={searchResults}
            loading={loading}
          />
          <PageControl
            pageInfo={pageInfo}
            queryParams={CleanSearchParams(searchParams)}
            onPageChange={handlePageChange}
          />
        </>
      )
    } else {
      resultsContent = <div className='text-center'>No results found for &apos;{q}&apos;</div>
    }
  }

  const sortIcon = <div className='border border-qrigray-300 rounded-lg text-qrigray-400 text-xs font-normal px-2 py-2 cursor-pointer'>
    Sort By
    <Icon icon='caretDown' size='2xs' className='ml-3' />
  </div>

  return (
    <ScrollLayout navBarProps={{
      showSearch: false
    }}>
      <>
        <Head data={{
          title: `${q ? `Datasets matching '${q}'` : 'Dataset Search'} | Qri`,
          pathname: '/search',
          description: 'Search thousands of public versioned datasets on qri.cloud'
        }}/>
        <div className='flex-grow w-full py-9 px-6'>
          <div className='w-full max-w-screen-lg mx-auto'>
            <div className='text-black text-3xl font-black mb-4'>Dataset Search</div>
            <div className='mb-5'>
              <SearchBox onSubmit={handleSearchSubmit} size='lg' placeholder='Search for Datasets' value={q} border={false}/>
            </div>
            <div className='flex items-center mb-5 h-8'>
              {searchResults.length > 0
                ? (
                  <>
                    <div className='flex-grow'>
                      <div className='text-qrigray-400 text-sm '>
                        { loading
                          ? (
                            <ContentLoader
                          width={300}
                          height={20}
                        >
                              <rect y="0" width="300" height="18" rx="6"/>
                            </ContentLoader>
                            )
                          : (
                            <>{pageInfo.resultCount} datasets found matching &apos;{q}&apos;</>
                            )}
                      </div>
                    </div>
                    <div>
                      <DropdownMenu
                      icon={sortIcon}
                      className='ml-8'
                      items={[
                        {
                          label: 'Dataset Name',
                          active: sort === 'name',
                          onClick: () => { updateQueryParams({ sort: 'name' }) }
                        },
                        {
                          label: 'Recently Updated',
                          active: sort === 'recentlyupdated',
                          onClick: () => { updateQueryParams({ sort: 'recentlyupdated' }) }
                        }
                      ]}
                    />
                    </div>
                  </>
                  )
                : (
                  <>&nbsp;</>
                  )}
            </div>
          </div>
          <div className='w-full max-w-screen-lg mx-auto overflow-hidden'>
            { resultsContent }
          </div>
        </div>
      </>
    </ScrollLayout>
  )
}

export default Search
