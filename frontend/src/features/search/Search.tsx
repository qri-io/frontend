import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import queryString from 'query-string'

import { loadSearchResults } from './state/searchActions'
import { selectSearchResults, selectSearchPageInfo } from './state/searchState'
import NavBar from '../navbar/NavBar';
import BigSearchBox from './BigSearchBox';
import SearchResultItem from './SearchResultItem'
import PageControl, { PageChangeObject } from '../../chrome/PageControl'
import Footer from '../footer/Footer'
import { NewSearchParams } from '../../qri/search'

const Search: React.FC<{}> = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { search } = useLocation()

  const scrollContainer = useRef<HTMLDivElement>(null)

  // get search results and accompanying pageInfo from the store
  const searchResults = useSelector(selectSearchResults)
  const pageInfo = useSelector(selectSearchPageInfo)

  const { q, page } = NewSearchParams(queryString.parse(search))

  // if the query string ever changes, fetch new data
  useEffect(() => {
    dispatch(loadSearchResults(q, page))
  }, [q, page, dispatch])

  // handle new search term input
  const handleSearchSubmit = (newQ:string) => {
    const newParams = new URLSearchParams(`q=${newQ}`)
    history.push({ search: newParams.toString() })
  }

  // handle page change from PageControl
  const handlePageChange = ({ selected: pageIndex }: PageChangeObject) => {
    const newPage = pageIndex + 1
    const newParams = new URLSearchParams(`q=${q}&page=${newPage}`)
    history.push({ search: newParams.toString() })
    if (scrollContainer.current) {
      scrollContainer.current.scrollTop = 0
    }
  }

  return (
    <div className='flex flex-col h-full w-full overflow-y-scroll' ref={scrollContainer} style={{ backgroundColor: '#f3f4f6'}}>
      <NavBar showSearch={false} />
      <div className='flex-grow w-full py-9'>
        <div className='w-4/5 max-w-screen-lg mx-auto mb-2'>
          <div className='text-qrinavy text-4xl font-bold mb-3'>Dataset Search</div>
          <BigSearchBox onSubmit={handleSearchSubmit} value={q}/>
        </div>
        <div className='w-4/5 max-w-screen-lg mx-auto'>
          {
            (searchResults.length > 0) ? (
              <>
                <div className='text-qrigray mb-2'>{pageInfo.resultCount} datasets found</div>
                <div className='px-8 rounded-lg bg-white h-full mb-6'>
                  {
                    searchResults.map((dataset) => <SearchResultItem key={`${dataset.peername}/${dataset.name}`} dataset={dataset} />)
                  }
                </div>
                <PageControl
                  pageInfo={pageInfo}
                  queryParams={{
                    q,
                    page
                  }}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
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
