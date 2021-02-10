import React from 'react'
import { push } from 'connected-react-router'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { ComponentName } from '../../qri/dataset'
import { newQriRef } from '../../qri/ref'
import DSComponents from '../ds_components/DatasetComponents'
import { pathToDatasetViewer } from './state/datasetPaths'
import { selectDataset } from './state/datasetState'

const DatasetComponents: React.FC<any> = () => {
  const dispatch = useDispatch()
  const dataset = useSelector(selectDataset)
  const { username, name, component } = newQriRef(useParams())
  const setSelectedComponent = (component: ComponentName) => {
    dispatch(push(pathToDatasetViewer(username, name, component)))
  }
  return <DSComponents 
    dataset={dataset} 
    selectedComponent={component as ComponentName || 'body'} 
    setSelectedComponent={setSelectedComponent} 
  /> 
}

export default DatasetComponents;
