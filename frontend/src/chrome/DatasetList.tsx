import React from 'react'

import SearchResultItem from '../features/search/SearchResultItem'
import { SearchResult } from '../qri/search'

export interface DatasetListProps {
  datasets: SearchResult[]
}

const DatasetList: React.FC<DatasetListProps> = ({ datasets }) => (
  <>
    {
      datasets.map((dataset) => <SearchResultItem key={`${dataset.peername}/${dataset.name}`} dataset={dataset} />)
    }
  </>
)

export default DatasetList
