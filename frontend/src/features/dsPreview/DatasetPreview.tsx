import React from 'react'
import { useParams } from 'react-router'
import { useSelector } from 'react-redux'

import { selectDataset, selectIsDatasetLoading } from '../dataset/state/datasetState'
import CommitSummaryHeader from '../commits/CommitSummaryHeader'
import DatasetComponent from '../dsComponents/DatasetComponent'
import { ComponentName, getComponentFromDatasetByName } from '../../qri/dataset'
import Spinner from '../../chrome/Spinner'
import DownloadDatasetButton from '../download/DownloadDatasetButton'
import { newQriRef } from '../../qri/ref'


const DatasetPreview: React.FC<{}> = () => {
  const qriRef = newQriRef(useParams())
  const dataset = useSelector(selectDataset)
  const loading = useSelector(selectIsDatasetLoading)

  return loading
  ? (<div className='w-full h-full p-4 flex justify-center items-center'>
      <Spinner color='#4FC7F3' />
    </div>)
  : (
    <div className='w-full h-full py-4 px-7 overflow-y-auto'>
      <CommitSummaryHeader dataset={dataset}>
        <DownloadDatasetButton qriRef={qriRef} />
      </CommitSummaryHeader>
      <div>
        {['readme', 'body', 'structure', 'meta']
          .filter((comp) => getComponentFromDatasetByName(dataset, comp))
          .map((componentName, i) => (
            <DatasetComponent
              key={componentName}
              componentName={componentName as ComponentName}
              dataset={dataset}
            />
          ))
        }
      </div>
    </div>
    )
}

export default DatasetPreview
