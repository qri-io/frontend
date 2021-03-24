import React from 'react'

import { QriRef } from '../../qri/ref'
import SideNavItem from './SideNavItem'
import TooltipContent from '../../chrome/TooltipContent'
import {
  pathToWorkflowEditor,
  pathToDatasetViewer,
  pathToDatasetIssues,
  pathToDatasetPreview,
  pathToActivityFeed,
} from './state/datasetPaths'

export interface DatasetNavSidebarProps {
  qriRef: QriRef
}

const DatasetNavSidebar: React.FC<DatasetNavSidebarProps> = ({ qriRef }) => (
  <div className='side-nav h-full bg-white relative'>
    <div className='absolute top-0 -right-10 w-10 h-10'>
      <svg className='w-full h-full' width="180" height="180" viewBox="0 0 180 180" fill="none">
        <path d="M4.19108e-05 180V0H180C72 0 3.05176e-05 86 4.19108e-05 180Z" fill="white"/>
      </svg>
    </div>
    {process.env.REACT_APP_FEATURE_WIREFRAMES &&
      <SideNavItem
        id='preview'
        icon='eye'
        to={pathToDatasetPreview(qriRef)}
        tooltip={
          <TooltipContent
            text='Preview'
            subtext='Explore the lastest version of this dataset'
          />
        }
      />
    }
    <SideNavItem
      id='components'
      icon='table'
      to={pathToDatasetViewer(qriRef)}
      tooltip={
        <TooltipContent
          text='Components'
          subtext='Explore the lastest version of this dataset'
        />
      }
    />
    <SideNavItem
      id='workflow-editor'
      icon='code'
      to={pathToWorkflowEditor(qriRef.username, qriRef.name)}
      tooltip={
        <TooltipContent
          text='Workflow Editor'
          subtext='Automate updates to this dataset'
        />
      }
    />
    <SideNavItem
      id='activity-feed'
      icon='clock'
      to={pathToActivityFeed(qriRef.username, qriRef.name)}
      tooltip={
        <TooltipContent
          text='Activity Feed'
          subtext='Inspect recent job activity and updates'
        />
      }
    />
    {process.env.REACT_APP_FEATURE_WIREFRAMES &&
      <SideNavItem
        id='issues'
        icon='exclamationTriangle'
        to={pathToDatasetIssues(qriRef)}
        tooltip={
          <TooltipContent
            text='Issues'
            subtext='Discuss this dataset'
          />
        }
      />
    }
  </div>
)

export default DatasetNavSidebar
