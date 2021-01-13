import React from 'react'
import { newVersionInfo, VersionInfo } from '../../qri/versionInfo'
import DatasetsTable from './DatasetsTable'

const datasets: VersionInfo[] = [
  {
    username: 'b5',
    name: 'world_bank_population',
  },
  {
    username: 'b5',
    name: 'gop_word'
  }
].map(newVersionInfo)

const Collection: React.FC<any> = () => {
  return <DatasetsTable
  filteredDatasets={datasets}
  // When the clearSelectedTrigger changes value, it triggers the ReactDataTable
  // to its internal the selections
  clearSelectedTrigger={false}
  onRowClicked={(row: VersionInfo) => {}}
  onSelectedRowsChange={() => {}}
  />
}

export default Collection