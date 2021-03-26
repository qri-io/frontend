import React from 'react'
import { push } from 'connected-react-router'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'

import { ComponentName } from '../../qri/dataset'
import { newQriRef } from '../../qri/ref'
import { pathToDatasetViewer } from '../dataset/state/datasetPaths'
import { selectDataset, selectIsDatasetLoading } from '../dataset/state/datasetState'
import DatasetCommits from '../commits/DatasetCommits'
import CommitSummaryHeader from '../commits/CommitSummaryHeader'
import TabbedComponentExplorer from './TabbedComponentExplorer'


const DatasetComponents: React.FC<{}> = () => {
  const qriRef = newQriRef(useParams())
  const dispatch = useDispatch()
  const dataset = useSelector(selectDataset)
  const loading = useSelector(selectIsDatasetLoading)

  const setSelectedComponent = (component: ComponentName) => {
    const dest = newQriRef(Object.assign({}, qriRef, { component : `/${component}` }))
    dispatch(push(pathToDatasetViewer(dest)))
  }

  return (
    <div className='flex-grow flex overflow-hidden'>
      <DatasetCommits qriRef={qriRef} />
      <div className='flex flex-col w-4/5 overflow-x-hidden'>
        <CommitSummaryHeader dataset={dataset} />
        <TabbedComponentExplorer
          dataset={dataset}
          loading={loading}
          selectedComponent={qriRef.component as ComponentName || 'body'} 
          setSelectedComponent={setSelectedComponent} 
        />
      </div>
    </div>
  )
}

export default DatasetComponents;
