import React from 'react'

import SearchResultItem from '../features/search/SearchResultItem'

import { SearchResult } from '../qri/search'

export interface DatasetListProps {
  datasets: SearchResult[]
  loading?: boolean
}

const DatasetList: React.FC<DatasetListProps> = ({ datasets, loading = false }) => {
  // if loading, return 5 searchResultItems in loading state
  if (loading) {
    return (
      <>
        <SearchResultItem loading />
        <SearchResultItem loading />
        <SearchResultItem loading />
        <SearchResultItem loading />
        <SearchResultItem loading />
      </>
    )
  }

  return (
    <>
      {
        datasets.map((dataset) => <SearchResultItem key={`${dataset.username}/${dataset.name}`} dataset={dataset} />)
      }
    </>
  )
}

export default DatasetList
