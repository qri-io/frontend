import React, { useState } from 'react'
import classNames from 'classnames'

import ComponentHeader from './ComponentHeader'
import Dataset, { ComponentName, qriRefFromDataset } from '../../qri/dataset'
import Transform from './transform/Transform'
import Body from './body/Body'
import BodyHeader from './body/BodyHeader'
import Commit from './commit/Commit'
import Meta from './meta/Meta'
import Structure from './structure/Structure'
import Readme from './readme/Readme'
import ContentBox from '../../chrome/ContentBox'
import IconLink from '../../chrome/IconLink'

export interface DatasetComponentProps {
  dataset: Dataset
  componentName: ComponentName
}

const DatasetComponent: React.FC<DatasetComponentProps> = ({
  dataset,
  componentName,
}) => {
  const [ expanded, setExpanded ] = useState(false)

  const handleToggleExpanded = () => {
    setExpanded(!expanded)
  }

  let component: JSX.Element
  let componentHeader: JSX.Element | null = null
  switch (componentName) {
    case 'body':
      component = <Body data={dataset} />
      componentHeader = <BodyHeader dataset={dataset} onToggleExpanded={handleToggleExpanded} showExpand={!expanded}/>
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

  let componentContent = (
    <div className='p-4'>
      {component}
    </div>
  )

  if (componentName === 'body') {
    componentContent = component
  }

  return (
    <>
    <div
      className={classNames('rounded-md bg-white w-full overflow-auto rounded-tl-none rounded-tr-none flex flex-col transform transition-all px-4', {})}
    >
      <ComponentHeader>
        {componentHeader}
      </ComponentHeader>
      <div className='overflow-auto flex-grow'>
        {componentContent}
      </div>
    </div>
    {/* full screen component view functions as a modal */}
    { expanded && (
        <div className="fixed top-0 right-0 bottom-0 left-0 inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-200 p-4 flex">
            <ContentBox className='flex-grow flex flex-col'>
              <div className='flex'>
                <div className='flex-grow'>
                  <div className='text-sm text-gray-400 font-mono'>
                    {dataset.peername}/{dataset.name}
                  </div>
                  <div className='text-xl text-qrinavy font-semibold'>
                    {dataset.meta?.title || dataset.name}
                  </div>
                </div>
                <div>
                  <IconLink icon='close' onClick={handleToggleExpanded} />
                </div>
              </div>
              <ComponentHeader>
                {componentHeader}
              </ComponentHeader>
              <div className='overflow-auto flex-grow'>
                {component}
              </div>
            </ContentBox>
          </div>
        </div>
    )}
    </>
  )
}

export default DatasetComponent
