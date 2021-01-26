import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import NavBar from '../navbar/NavBar'
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

  return (<div>
    <NavBar />
    <header>
      <h1 className='text-2xl font-bold'>Collection</h1>
    </header>
    <DatasetsTable
      filteredDatasets={datasets}
      // When the clearSelectedTrigger changes value, it triggers the ReactDataTable
      // to its internal the selections
      clearSelectedTrigger={false}
      onRowClicked={(row: VersionInfo) => {}}
      onSelectedRowsChange={() => {}}
      />
  </div>)
}

export default Collection