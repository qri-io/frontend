import React from 'react'
import ComponentHeader from './ComponentHeader'
import classNames from 'classnames'

import Dataset, { ComponentName, qriRefFromDataset } from '../../qri/dataset'
import Transform from './datasetComponents/Transform'
import Body from './datasetComponents/Body'
import Commit from './datasetComponents/Commit'
import Meta from './datasetComponents/Meta'
import Structure from './datasetComponents/Structure'
import Readme from './datasetComponents/Readme'

export interface DatasetComponentProps {
  dataset: Dataset
  componentName: ComponentName
  noHeader?: boolean
}

const DatasetComponent: React.FC<DatasetComponentProps> = ({
  dataset,
  componentName,
  noHeader = false
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
    case 'readme':
      component = <Readme qriRef={qriRefFromDataset(dataset)}/>
      break
    default:
      component = <div>Unknown component</div>
  }

  return (
    <div
      className={classNames(
        'rounded-md bg-white w-full overflow-auto', {
        'rounded-tl-none' : noHeader,
        'my-6': !noHeader
      })}
    >
      {!noHeader && <ComponentHeader componentName={componentName} />}
      {component}
    </div>
  )
}

export default DatasetComponent
