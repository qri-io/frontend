import React, { useState } from 'react'
import { Dataset, ComponentList, Structure, Body } from '../../qri/dataset'

interface DatasetPreviewProps {
  data: Dataset
}

export const DatasetPreview: React.FC<DatasetPreviewProps> = ({ data }) => {
  const [componentTab, setComponentTab] = useState('commit')

  const presentComponents: string[] = Object.keys(data).filter((c: string) => {
    return ComponentList.includes(c) && c !== 'body'
  })

  const tabs: Tab[] = []
  ComponentList.forEach((component: string) => { 
    if (component === 'body') {
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
      content={data[componentTab]}
    />
    <BodyDisplay 
      structure={data.structure}
      body={data.body}
    />
  </div>
}

interface Tab {
  name: string
  clickable?: boolean
}

interface TabbedDisplayProps {
  activeTab: string
  tabs: Tab[]
  onTabClick: (tab: string) => void
  content: string | Record<string, any>
}

const TabbedDisplay: React.FC<TabbedDisplayProps> = (props) => {
  const {
    activeTab,
    tabs,
    onTabClick,
    content
  } = props

  return <div className='w-full'>
    <div className='w-full border-b flex'>
      {
        tabs.map((tab: Tab) => {
          if (tab.name === activeTab) {
            return <div 
                    key={tab.name}
                    className='flex-initial m-4 font-bold cursor-default border-b-2'
                    onClick={() => onTabClick(tab.name)}
                  >{tab.name}</div>
          }
          if (tab.clickable) {
            return <div 
                    key={tab.name}
                    className='flex-initial m-4 font-bold cursor-pointer'
                    onClick={() => onTabClick(tab.name)}
                  >{tab.name}</div>
          }
          return <div key={tab.name} className='flex-initial m-4 text-gray-400 cursor-default'>{tab.name}</div>
        })
      }
    </div>
    <div className='p-4 border'>
      <pre className='max-h-60 overflow-x-hidden overflow-y-auto '>
        {typeof content === 'string'? content : JSON.stringify(content, null, 4)}
      </pre>
    </div>
  </div>
}

interface BodyDisplayProps {
  structure?: Structure
  body?: Body
}

const BodyDisplay: React.FC<BodyDisplayProps> = (props) => {
  const { structure, body } = props
  if (!structure || !body) {
    return null
  }

  return <div>
    { structure.format !== 'csv'
      ? <pre className='p-4'>{JSON.stringify(body, null, 2)}</pre>
      : <SimpleTable {...props} />
    }
    <div className='text-right text-xs p-2'>Preview of first 10 rows</div>
  </div>
}

const SimpleTable: React.FC<BodyDisplayProps> = (props) => {
  const { structure, body} = props
  if (!structure || !body) {
    return null
  }
  let headers = selectHeaders(structure)
  if (!headers) {
    return null
  }

  headers = [{"title":"", "type": ""}].concat(headers)
  return <div className='overflow-auto max-h-100 border-t'>
    <table className='table-auto border-collapse relative'>
      <thead>
        <tr>
          {headers.map((header: Header, i: number) => {
            return <th className='border-b border-l border-r text-left p-2 whitespace-nowrap sticky top-0 bg-white shadow' key={i}>{header.title}</th>
          })}
        </tr>
      </thead>
      <tbody>
        {body.map((row: any[], i: number) => {
          return <tr key={i}>
            <td className='border text-center p-2'>{i+1}</td>
            {row.map((el: any, j: number) => {
              return <td className='border text-left p-2 whitespace-nowrap' key={j}>{el}</td>
            })}
          </tr>
        })}
      </tbody>
    </table>
  </div>
}

interface Header {
  title: string
  type: string
}

function selectHeaders(structure: Structure): Header[] | undefined {
  if (!(structure.schema && structure.schema.items && structure.schema.items.items)) {
    return
  }
  return structure.schema.items.items
}