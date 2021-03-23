import React from 'react'
import { push } from 'connected-react-router'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { ComponentName } from '../../qri/dataset'
import { newQriRef, QriRef } from '../../qri/ref'
import DSComponents from '../dsComponents/DatasetComponents'
import { pathToDatasetViewer } from './state/datasetPaths'
import { selectDataset, selectIsDatasetLoading } from './state/datasetState'
import { DatasetComponentProps } from '../dsComponents/DatasetComponent'
import DatasetCommits from '../commits/DatasetCommits'
import CommitSummaryHeader from '../commits/CommitSummaryHeader'

export interface DatasetComponentsProps {
  qriRef: QriRef
}

const DatasetComponents: React.FC<DatasetComponentProps> = ({
  qriRef
}) => {
  const dispatch = useDispatch()
  const dataset = useSelector(selectDataset)
  const { username, name, component } = newQriRef(useParams())
  const setSelectedComponent = (component: ComponentName) => {
    dispatch(push(pathToDatasetViewer(username, name, component)))
  }
  const loading = useSelector(selectIsDatasetLoading)

  return (
    <div className='w-full flex-grow flex overflow-y-hidden'>
      <DatasetCommits qriRef={qriRef} />
      <div className='flex flex-col h-full w-full'>
        <CommitSummaryHeader dataset={dataset} />
        <DSComponents
          dataset={dataset} 
          loading={loading}
          selectedComponent={component as ComponentName || 'body'} 
          setSelectedComponent={setSelectedComponent} 
        />
      </div>
    </div>
  )
}

export default DatasetComponents;
