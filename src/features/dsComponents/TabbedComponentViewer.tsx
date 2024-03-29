// @ts-nocheck
import React from 'react'
import classNames from 'classnames'

import Dataset, { ComponentName, isDatasetEmpty, NewDataset } from '../../qri/dataset'
import ComponentList from './ComponentList'
import DatasetComponent from './DatasetComponent'

export interface TabbedComponentViewerProps {
  dataset: Dataset
  selectedComponent?: ComponentName
  // border is used to display TabbedComponentViewer over a white background e.g. on the workflow editor
  border?: boolean
  // preview will cause the body component to render only what is in dataset and not fetch more data
  preview?: boolean
  // used to disable loading state when rendering the component viewer in the workflow
  showLoadingState?: boolean
  // renders the component tabs as editors
  editor?: boolean
}

export const TabbedComponentViewer: React.FC<TabbedComponentViewerProps> = ({
  dataset: ds,
  selectedComponent,
  border = false,
  preview = false,
  showLoadingState = true,
  children,
  editor = false
}) => {
  let dataset = ds

  if (!ds || isDatasetEmpty(ds)) {
    dataset = NewDataset({})
  }

  return (
    <div className={'flex flex-col w-full mt-1 pt-4 h-full min-h-0'}>
      <ComponentList
        dataset={dataset}
        selectedComponent={selectedComponent}
        border={border}
        editor={editor}
      />
      <div
        className={classNames('rounded-md bg-white w-full overflow-auto rounded-tl-none rounded-tr-none flex-grow flex flex-col px-4', {
          'border-r-2 border-b-2 border-l-2 border-qrigray-200 rounded-b-lg': border
        })}
      >
        {
          children || (
            <DatasetComponent
              dataset={dataset}
              componentName={selectedComponent}
              preview={preview}
              showLoadingState={showLoadingState}
              editor={editor}
            />
          )
        }
      </div>
    </div>
  )
}

export default TabbedComponentViewer
