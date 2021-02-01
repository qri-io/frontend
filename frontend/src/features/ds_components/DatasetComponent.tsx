import React from 'react'
import Dataset, { ComponentName } from '../../qri/dataset'
import ComponentHeader from './ComponentHeader'

export interface DatasetComponentProps {
  dataset: Dataset
  componentName: ComponentName
}

const DatasetComponent: React.FC<DatasetComponentProps> = ({
  dataset,
  componentName
}) => {
  return (
    <div>
      <ComponentHeader componentName={componentName} />
      <h1>Component: {componentName}</h1>
    </div>
  )
}

export default DatasetComponent