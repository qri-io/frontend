import React, { useState } from 'react'
import { Dataset, ComponentNames, getComponentFromDatasetByName } from '../../../qri/dataset'
import { TabbedDisplay, Tab } from './TabbedDisplay'
import { BodyDisplay } from './BodyDisplay'

interface DatasetPreviewProps {
  data: Dataset
}

export const DatasetPreview: React.FC<DatasetPreviewProps> = ({ data }) => {
  const [componentTab, setComponentTab] = useState('body')

  const presentComponents: string[] = Object.keys(data).filter((c: string) => {
    return ComponentNames.includes(c) && c !== 'stats'
  })

  const tabs: Tab[] = []
  ComponentNames.sort().forEach((component: string) => {
    if (component === 'stats') {
      return
    }
    const tab: Tab = { name: component }
    if (presentComponents.includes(component)) {
      tab.clickable = true
    }
    tabs.push(tab)
  })

  let content: JSX.Element = <></>

  if (componentTab === 'body') {
    content = <BodyDisplay
      structure={data.structure}
      body={data.body}
    />
  } else {
    const component = getComponentFromDatasetByName(data, componentTab) || `No content for ${componentTab} could be found`
    content = <div className='p-4 border'>
      <pre className='max-h-80 overflow-x-hidden overflow-y-auto'>
        {typeof component === 'string' ? component : JSON.stringify(component, null, 4)}
      </pre>
    </div>
  }

  return <div id='dataset-preview' style={{ width: 1000 }}>
    <TabbedDisplay
      activeTab={componentTab}
      tabs={tabs}
      onTabClick={setComponentTab}
      content={content}
    />
  </div>
}
