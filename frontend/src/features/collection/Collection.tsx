import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import PageLayout from '../app/PageLayout'
import { VersionInfo } from '../../qri/versionInfo'
import DatasetsTable from './DatasetsTable'
import { loadDatasets } from './state/collectionActions'
import { selectCollection } from './state/collectionState'

const Collection: React.FC<any> = () => {
  const dispatch = useDispatch()
  const datasets = useSelector(selectCollection)

  useEffect(() => {
    dispatch(loadDatasets(1,50))
  }, [dispatch])

  return (
    <PageLayout>
      <div className='max-w-screen-xl mx-auto px-10 py-20'>
        <header className='mb-8'>
          <h1 className='text-2xl font-extrabold'>Datasets</h1>
        </header>

        <DatasetsTable
          filteredDatasets={datasets}
          // When the clearSelectedTrigger changes value, it triggers the ReactDataTable
          // to its internal the selections
          clearSelectedTrigger={false}
          onRowClicked={(row: VersionInfo) => {}}
          onSelectedRowsChange={() => {}}
        />
      </div>
    </PageLayout>
  )
}

export default Collection
