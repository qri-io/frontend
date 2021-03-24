import React from 'react'
import { SyncLoader } from 'react-spinners'

import Dataset, { ComponentName, isDatasetEmpty, NewDataset } from '../../qri/dataset'
import ComponentList from './ComponentList'
import DatasetComponent from './DatasetComponent'

export interface TabbedComponentExplorerProps {
  dataset: Dataset
  selectedComponent: ComponentName
  setSelectedComponent: (name: ComponentName) => void
  loading: boolean
}

export const TabbedComponentExplorer: React.FC<TabbedComponentExplorerProps> = ({
  dataset: ds,
  loading,
  selectedComponent,
  setSelectedComponent
}) => {
  if (loading) {
    return (<div className='p-4 h-full w-full flex justify-center items-center bg-white rounded-md'>
              <SyncLoader color='#4FC7F3' />
            </div>)
  }

  let dataset = ds

  if (!ds || isDatasetEmpty(ds)) {
    dataset = NewDataset({})
  }

  return (
    <div className='flex flex-col w-full p-4 overflow-hidden'>
      <ComponentList
        dataset={dataset}
        onClick={setSelectedComponent}
        selectedComponent={selectedComponent}
      />
      <DatasetComponent
        dataset={dataset}
        componentName={selectedComponent}
        noHeader
      />
    </div>
  )
}

export default TabbedComponentExplorer
