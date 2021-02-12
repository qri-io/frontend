import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import PageLayout from '../app/PageLayout'
import { VersionInfo } from '../../qri/versionInfo'
import DatasetsTable from './DatasetsTable'
import { loadDatasets } from './state/collectionActions'
import { selectCollection, selectIsCollectionLoading } from './state/collectionState'
import { SyncLoader } from 'react-spinners'

const Collection: React.FC<any> = () => {
  const dispatch = useDispatch()
  const datasets = useSelector(selectCollection)
  const loading = useSelector(selectIsCollectionLoading)

  useEffect(() => {
    dispatch(loadDatasets(1,50))
  }, [dispatch])

  return (
    <PageLayout>
      <div className='h-full max-w-screen-xl mx-auto px-10 py-20'>
        <header className='mb-8'>
          <h1 className='text-2xl font-extrabold'>Collection</h1>
        </header>

        { loading
          ? <div className='h-full w-full flex justify-center items-center'><SyncLoader /></div>
          : <DatasetsTable
              filteredDatasets={datasets}
              // When the clearSelectedTrigger changes value, it triggers the ReactDataTable
              // to its internal the selections
              clearSelectedTrigger={false}
              onRowClicked={(row: VersionInfo) => {}}
              onSelectedRowsChange={() => {}}
            />
        }
      </div>
    </PageLayout>
  )
}

export default Collection
