import React, { useState } from 'react'
import classNames from 'classnames'

import ComponentHeader from './ComponentHeader'
import Dataset, { ComponentName } from '../../qri/dataset'
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
  // preview will cause the body component to render only what is in dataset and not fetch more data
  preview?: boolean
}

const DatasetComponent: React.FC<DatasetComponentProps> = ({
  dataset,
  componentName,
  preview = false
}) => {
  const [ expanded, setExpanded ] = useState(false)

  const handleToggleExpanded = () => {
    setExpanded(!expanded)
  }

  let component: JSX.Element
  let componentHeader: JSX.Element | null = null
  switch (componentName) {
    case 'body':
      component = <Body data={dataset} preview={preview} />
      componentHeader = (
        <BodyHeader
          dataset={dataset}
          onToggleExpanded={handleToggleExpanded}
          showDownload={!preview}
          showExpand={!expanded}
        />
      )
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
      component = <Readme data={dataset.readme}/>
      break
    default:
      component = <div>Unknown component</div>
  }

  let componentContent = (
    <div className='p-4 h-full'>
      {component}
    </div>
  )

  // exclude the default padding for some components
  if (['body', 'structure', 'transform'].includes(componentName)) {
    componentContent = component
  }

  return (
    <div
      className={classNames('rounded-md bg-white h-full w-full overflow-auto rounded-tl-none rounded-tr-none flex flex-col pb-4', {})}
    >
      <ComponentHeader border={!['body', 'structure', 'transform'].includes(componentName)}>
        {componentHeader}
      </ComponentHeader>
      <div className='overflow-auto flex-grow'>
        {componentContent}
      </div>

    {/* full screen component view functions as a modal */}
    { expanded && (
        <div className="fixed top-0 right-0 bottom-0 left-0 inset-0 transition-opacity z-20" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-200 p-4 flex">
            <ContentBox className='flex-grow flex flex-col'>
              <div className='flex'>
                <div className='flex-grow'>
                  <div className='text-sm text-gray-400 font-mono'>
                    {dataset.peername}/{dataset.name}
                  </div>
                  <div className='text-xl text-black font-semibold'>
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
              <div style={{maxHeight: 'calc(100% - 92px)'}} className='overflow-auto flex-grow'>
                {component}
              </div>
            </ContentBox>
          </div>
        </div>
    )}
    </div>
  )
}

export default DatasetComponent
