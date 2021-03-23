import React from 'react'
import { push } from 'connected-react-router'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { ComponentName } from '../../qri/dataset'
import { newQriRef, QriRef } from '../../qri/ref'
import DSComponents from '../ds_components/DatasetComponents'
import { pathToDatasetViewer } from './state/datasetPaths'
import { selectDataset, selectIsDatasetLoading } from './state/datasetState'
import { DatasetComponentProps } from '../ds_components/DatasetComponent'
import DatasetCommits from '../commits/DatasetCommits'

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
      <DSComponents
        dataset={dataset} 
        loading={loading}
        selectedComponent={component as ComponentName || 'body'} 
        setSelectedComponent={setSelectedComponent} 
      />
    </div>
  )
}

export default DatasetComponents;
