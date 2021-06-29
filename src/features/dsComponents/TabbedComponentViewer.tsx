import React from 'react'
import classNames from 'classnames'

import Dataset, { ComponentName, isDatasetEmpty, NewDataset } from '../../qri/dataset'
import ComponentList from './ComponentList'
import DatasetComponent from './DatasetComponent'
import Spinner from '../../chrome/Spinner'

export interface TabbedComponentViewerProps {
  dataset: Dataset
  selectedComponent?: ComponentName
  setSelectedComponent?: (name: ComponentName) => void
  loading?: boolean
  // border is used to display TabbedComponentViewer over a white background e.g. on the workflow editor
  border?: boolean
  // preview will cause the body component to render only what is in dataset and not fetch more data
  preview?: boolean
}

export const TabbedComponentViewer: React.FC<TabbedComponentViewerProps> = ({
  dataset: ds,
  loading,
  selectedComponent,
  setSelectedComponent,
  border = false,
  preview = false,
  children
}) => {
  if (loading) {
    return (
      <div className='p-4 h-full w-full flex justify-center items-center bg-white rounded-md'>
        <Spinner color='#4FC7F3' />
      </div>
    )
  }

  let dataset = ds

  if (!ds || isDatasetEmpty(ds)) {
    dataset = NewDataset({})
  }

  return (
    <div className={'flex flex-col w-full mt-1 pt-4 h-full'}>
      <ComponentList
        dataset={dataset}
        onClick={setSelectedComponent}
        selectedComponent={selectedComponent}
        border
      />
      <div
        className={classNames('rounded-md bg-white w-full overflow-auto rounded-tl-none rounded-tr-none flex-grow flex flex-col transform transition-all px-4', {
          'border-r-2 border-b-2 border-l-2 border-qrigray-200 rounded-b-lg': border
        })}
      >
        {
          children || (
            <DatasetComponent
              dataset={dataset}
              componentName={selectedComponent}
              preview={preview}
            />
          )
        }
      </div>
    </div>
  )
}

export default TabbedComponentViewer
