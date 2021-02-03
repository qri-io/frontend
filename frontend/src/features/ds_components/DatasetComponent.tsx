import React from 'react'
import Dataset, { ComponentName } from '../../qri/dataset'
import ComponentHeader from './ComponentHeader'

import Transform from './datasetComponents/Transform'
import Body from './datasetComponents/Body'
import Commit from './datasetComponents/Commit'
import Meta from './datasetComponents/Meta'
import Structure from './datasetComponents/Structure'

export interface DatasetComponentProps {
  dataset: Dataset
  componentName: ComponentName
}

const DatasetComponent: React.FC<DatasetComponentProps> = ({
  dataset,
  componentName
}) => {

  let component: JSX.Element
  switch (componentName) {
    case 'body':
      component = <Body data={dataset}/>
      break
    case 'meta':
      component = <Meta data={dataset.meta}/>
      break
    case 'commit':
      component = <Commit data={dataset.commit}/>
      break
    case 'structure':
      component = <Structure data={dataset.structure}/>
      break
    case 'transform':
      component = <Transform data={dataset.transform}/>
      break
    default:
      component = <div>Unknown component</div>
  }

  return (
    <div>
      <ComponentHeader componentName={componentName} />
      {component}
    </div>
  )
}

export default DatasetComponent