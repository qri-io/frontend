import React from 'react'

import { QriRef } from '../../qri/ref'
import SideNavItem from './SideNavItem'
import TooltipContent from '../../chrome/TooltipContent'

export interface DatasetNavSidebarProps {
  qriRef: QriRef
}

const DatasetNavSidebar: React.FC<DatasetNavSidebarProps> = ({ qriRef }) => (
  <div className='side-nav h-full bg-white'>
    <SideNavItem
      id='workflow-editor'
      icon='code'
      to={`/ds/${qriRef.username}/${qriRef.name}`}
      tooltip={
        <TooltipContent
          text='Workflow Editor'
          subtext='Automate updates to this dataset'
        />
      }
    />
    <SideNavItem
      id='components'
      icon='table'
      to={`/ds/${qriRef.username}/${qriRef.name}/components`}
      tooltip={
        <TooltipContent
          text='Components'
          subtext='Explore the lastest version of this dataset'
        />
      }
    />
    <SideNavItem
      id='activity-feed'
      icon='clock'
      to={`/ds/${qriRef.username}/${qriRef.name}/history`}
      tooltip={
        <TooltipContent
          text='Activity Feed'
          subtext='Inspect recent job activity and updates'
        />
      }
    />
  </div>
)

export default DatasetNavSidebar
