import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useDimensions from 'react-use-dimensions'

import { loadCollection } from './state/collectionActions'
import { selectCollection, selectIsCollectionLoading } from './state/collectionState'
import FixedLayout from '../layouts/FixedLayout'
import CollectionTable from './CollectionTable'
import Spinner from '../../chrome/Spinner'
import Link from '../../chrome/Link'
import NewDatasetButton from '../../chrome/NewDatasetButton'
import Icon from '../../chrome/Icon'
import SearchBox from '../search/SearchBox'
import { filterVersionInfos } from '../../qri/versionInfo'
import { trackGoal } from '../../features/analytics/analytics'
import Head from '../../features/app/Head'

const Collection: React.FC<{}> = () => {
  const dispatch = useDispatch()
  const fullCollection = useSelector(selectCollection)
  const loading = useSelector(selectIsCollectionLoading)

  const [ searchString, setSearchString ] = useState('')

  const handleSearchChange = (q: string) => {
    // collection-filter-by-text event
    trackGoal('ZAC6ZOWU', 0)
    setSearchString(q)
  }

  useEffect(() => {
    dispatch(loadCollection())
  }, [dispatch])

  const [tableContainer, { height: tableContainerHeight }] = useDimensions()

  const collection = searchString ? filterVersionInfos(fullCollection, searchString) : fullCollection

  let resultsContent = (
    <div className='rounded-none h-full'>
      <CollectionTable
        filteredWorkflows={collection}
        // When the clearSelectedTrigger changes value, it triggers the ReactDataTable
        // to its internal the selections
        clearSelectedTrigger={false}
        onSelectedRowsChange={() => {}} // TODO(chriswhong): wire up selection state
        containerHeight={tableContainerHeight}
      />
    </div>
  )

  // if loading and there is no collection, show a spinner
  if (loading && (collection.length === 0)) {
    resultsContent = (
      <div className='h-full w-full flex justify-center items-center'>
        <Spinner color='#43B3B2' />
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
          You don&apos;t have any datasets!<br/> You can push datasets using <Link to='https://qri.io/docs/getting-started/qri-cli-quickstart'>qri CLI</Link>.
        </div>
      </div>
    )
  }

  return (
    <FixedLayout>
      <Head data={{
        title: `My Datasets | Qri`,
        appView: true
      }}/>
      <div className='h-full' style={{ backgroundColor: '#f3f4f6' }}>
        <div className='h-full w-9/12 mx-auto pt-7 pb-7 flex flex-col'>
          <header className='mb-7 flex text-black items-end'>
            <div className='flex-grow flex items-center justify-start'>
              <h1 className='text-3xl font-extrabold mb-1'>My Datasets </h1>
              <div>
                <div id='collection_count' className='bg-qrigray-400 text-white rounded px-2 py-1 ml-2 leading-none flex-grow-0'>
                  {collection.length}
                </div>
              </div>
              { loading && collection.length > 0 && (
                <div>
                  <Icon icon='loader' className='ml-2 text-qrigray-400'/>
                </div>
              )}
            </div>

            <div className='w-1/2 flex items-center justify-end'>
              <div className='w-48'>
                <SearchBox onChange={handleSearchChange} placeholder='Filter by name' dark transparent />
              </div>
              <div className='ml-2'><NewDatasetButton id='new_dataset_button' /></div>
            </div>
          </header>
          <div ref={tableContainer} className='overflow-y-hidden rounded-lg relative flex-grow bg-white'>
            {resultsContent}
          </div>
        </div>
      </div>
    </FixedLayout>
  )
}

export default Collection
