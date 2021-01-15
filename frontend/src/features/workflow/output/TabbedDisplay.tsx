import React from 'react'

export interface Tab {
  name: string
  clickable?: boolean
}

interface TabbedDisplayProps {
  activeTab: string
  tabs: Tab[]
  onTabClick: (tab: string) => void
  content: JSX.Element
}

export const TabbedDisplay: React.FC<TabbedDisplayProps> = (props) => {
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
    {content}

  </div>
}