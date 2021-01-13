import React from 'react'
import { useSelector } from 'react-redux'
import { selectDataset } from './state/datasetState'

const DatasetComponents: React.FC<any> = () => {
  const dataset = useSelector(selectDataset)

  return (
    <div className='text-left p-6'>
      <p>Dataset Components View Goes Here</p>
      {JSON.stringify(dataset, null, 2)}
    </div>
  )
}

export default DatasetComponents;
