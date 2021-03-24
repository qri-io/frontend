import React from 'react'
import { useSelector } from 'react-redux'
import { SyncLoader } from 'react-spinners'

import { selectDataset, selectIsDatasetLoading } from '../dataset/state/datasetState'
import CommitSummaryHeader from '../commits/CommitSummaryHeader'
import DatasetComponent from '../dsComponents/DatasetComponent'
import { ComponentName, getComponentFromDatasetByName } from '../../qri/dataset'


const DatasetPreview: React.FC<{}> = () => {
  const dataset = useSelector(selectDataset)
  const loading = useSelector(selectIsDatasetLoading)

  return loading
  ? (<div className='w-full h-full p-4 flex justify-center items-center'>
      <SyncLoader color='#4FC7F3' />
    </div>)
  : (
    <div className='w-full h-full p-4 overflow-y-auto'>
      <CommitSummaryHeader dataset={dataset} />
      <div className='mx-4'>
        {['readme', 'body', 'structure', 'meta']
          .filter((comp) => getComponentFromDatasetByName(dataset, comp))
          .map((componentName, i) => (
            <DatasetComponent componentName={componentName as ComponentName} dataset={dataset} />
          ))
        }
      </div>
    </div>
    )
}

export default DatasetPreview
