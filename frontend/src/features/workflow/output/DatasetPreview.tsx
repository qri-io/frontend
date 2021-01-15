import React, { useState } from 'react'
import { Dataset, ComponentNames, getComponentFromDatasetByName } from '../../../qri/dataset'
import { TabbedDisplay, Tab } from './TabbedDisplay'
import { BodyDisplay } from './BodyDisplay'

interface DatasetPreviewProps {
  data: Dataset
}

export const DatasetPreview: React.FC<DatasetPreviewProps> = ({ data }) => {
  const [componentTab, setComponentTab] = useState('commit')

  const presentComponents: string[] = Object.keys(data).filter((c: string) => {
    return ComponentNames.includes(c) && c !== 'body' && c !== 'stats'
  })

  const tabs: Tab[] = []
  ComponentNames.forEach((component: string) => { 
    if (component === 'body' || component === 'stats') {
      return
    }
    const tab: Tab = { name: component }
    if (presentComponents.includes(component)) {
      tab.clickable = true
    }
    tabs.push(tab)
  })

  return <div className='w-full bg-white'>
    <TabbedDisplay
      activeTab={componentTab}
      tabs={tabs}
      onTabClick={setComponentTab}
      content={getComponentFromDatasetByName(data, componentTab) || `No content for ${componentTab} could be found`}
    />
    <BodyDisplay 
      structure={data.structure}
      body={data.body}
    />
  </div>
}

