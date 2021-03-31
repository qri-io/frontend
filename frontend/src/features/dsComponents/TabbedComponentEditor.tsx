import React from 'react'

import Dataset, { ComponentName } from '../../qri/dataset'
import ComponentList from './ComponentList'
import Spinner from '../../chrome/Spinner'
import ComponentEditor from './ComponentEditor'

export interface TabbedComponentViewerProps {
  dataset: Dataset
  selectedComponent: ComponentName
  setSelectedComponent: (name: ComponentName) => void
  onDatasetChange: (field: string[], value: any) => void
  loading: boolean
}

export const TabbedComponentEditor: React.FC<TabbedComponentViewerProps> = ({
  dataset: ds,
  loading,
  selectedComponent,
  setSelectedComponent,
  onDatasetChange,
}) => {
  if (loading) {
    return (
      <div className='p-4 h-full w-full flex justify-center items-center bg-white rounded-md'>
        <Spinner color='#4FC7F3' />
      </div>
    )
  }

  let dataset = ds
  // if (!ds || isDatasetEmpty(ds)) {
  //   dataset = NewDataset({})
  // }

  return (
    <div className='flex flex-col w-full p-4 overflow-hidden'>
      <ComponentList
        dataset={dataset}
        onClick={setSelectedComponent}
        selectedComponent={selectedComponent}
        allowClickMissing
      />
      <ComponentEditor
        dataset={dataset}
        componentName={selectedComponent}
        onDatasetChange={onDatasetChange}
        noHeader
      />
    </div>
  )
}

export default TabbedComponentEditor
