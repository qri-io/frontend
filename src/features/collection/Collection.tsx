import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import useDimensions from 'react-use-dimensions'

import { loadCollection } from './state/collectionActions'
import { selectCollection, selectIsCollectionLoading } from './state/collectionState'
import PageWithFooter from '../app/PageWithFooter'
import CollectionTable from './CollectionTable'
import Button from '../../chrome/Button'
import Spinner from '../../chrome/Spinner'
import TextLink from '../../chrome/TextLink'
import SearchBox from '../search/SearchBox'
import { filterVersionInfos } from '../../qri/versionInfo'

const Collection: React.FC<{}> = () => {
  const dispatch = useDispatch()
  const fullCollection = useSelector(selectCollection)
  const loading = useSelector(selectIsCollectionLoading)

  const [ searchString, setSearchString ] = useState('')

  const handleSearchChange = (q) => {
    setSearchString(q)
  }

  useEffect(() => {
    dispatch(loadCollection())
  }, [dispatch])

  const [tableContainer, { height: tableContainerHeight }] = useDimensions();

  const collection = searchString ? filterVersionInfos(fullCollection, searchString) : fullCollection

  let resultsContent = (
    <CollectionTable
      filteredWorkflows={collection}
      // When the clearSelectedTrigger changes value, it triggers the ReactDataTable
      // to its internal the selections
      clearSelectedTrigger={false}
      onSelectedRowsChange={() => {}} // TODO(chriswhong): wire up selection state
      containerHeight={tableContainerHeight}
      searchString={searchString}
    />
  )

  // if loading, show a spinner
  if (loading) {
    resultsContent = (
      <div className='h-full w-full flex justify-center items-center'>
        <Spinner color='#4FC7F3' />
      </div>
    )
  }

  // if no results, show a message
  if (!loading && collection.length === 0) {
    resultsContent = (
      <div className='h-full w-full flex justify-center items-center text-qrigray-400'>
        No datasets found for&nbsp;
        <span className='font-semibold'>{searchString}</span>
      </div>
    )
  }

  // if no results in the full collection (new user), show a nudge
  if (!loading && fullCollection.length === 0) {
    resultsContent = (
      <div className='h-full w-full flex justify-center items-center text-qrigray-400'>
        <div className='text-center'>
          You don't have any datasets!<br/> You can push datasets using <TextLink to='https://qri.io/docs/getting-started/qri-cli-quickstart'>qri CLI</TextLink>.
        </div>
      </div>
    )
  }

  return (
    <PageWithFooter>
      <div className='h-full' style={{ backgroundColor: '#f3f4f6'}}>
        <div className='h-full w-9/12 mx-auto pt-10 pb-8 flex flex-col'>
          <header className='mb-8 flex text-qrinavy items-end'>
            <div className='flex-grow flex items-center justify-start'>
              <h1 className='text-3xl font-extrabold mb-1'>My Datasets </h1>
              <div>
                <div className='bg-qrigray-400 text-white rounded px-2 py-1 ml-2 leading-none flex-grow-0'>
                  {collection.length}
                </div>
              </div>
            </div>

            <div className='w-1/2 flex items-center justify-end'>
              <SearchBox onChange={handleSearchChange} placeholder='Filter' dark />
              <Link to='/ds/new'>
                <Button type='secondary'>
                  New Dataset
                </Button>
              </Link>
            </div>
          </header>
          <div ref={tableContainer} className='overflow-y-hidden rounded-lg relative flex-grow bg-white relative'>
            {resultsContent}
          </div>
        </div>
      </div>
    </PageWithFooter>
  )
}

export default Collection