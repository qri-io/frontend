import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { QriRef } from '../../qri/ref'
import DatasetSideNavItem from './DatasetSideNavItem'
import TooltipContent from '../../chrome/TooltipContent'
import Icon from '../../chrome/Icon'
import {
  pathToWorkflowEditor,
  pathToDatasetViewer,
  pathToDatasetIssues,
  pathToDatasetPreview,
  pathToActivityFeed,
} from './state/datasetPaths'

import { selectNavExpanded } from '../app/state/appState'
import { toggleNavExpanded } from '../app/state/appActions'

export interface DatasetNavSidebarProps {
  qriRef: QriRef
}

const DatasetNavSidebar: React.FC<DatasetNavSidebarProps> = ({ qriRef }) => {
  const expanded = useSelector(selectNavExpanded)
  const dispatch = useDispatch()

  const toggleExpanded = () => {
    dispatch(toggleNavExpanded())
  }

  return (
    <div className={`side-nav pl-9 h-full bg-white relative pt-9 ${expanded ? 'w-52' : 'w-24'}`}>
      <div className='mb-9 flex align-center flex'>
        <div
          className='text-gray-400 text-sm font-medium mr-4 leading-6 transition-all duration-700'
          style={{
            width: expanded ? 'auto' : 0,
            display: expanded ? 'block' : 'none'
          }}
        >
          DATASET MENU
        </div>
        <div className='cursor-pointer flex items-center w-6' onClick={toggleExpanded}>
          <Icon className='m-auto' icon={expanded ? 'caretLeft' : 'caretRight'} size='xs' />
        </div>
      </div>
      <div className="absolute top-0 -right-10 w-10 h-10 bg-white" />
      <div className="absolute top-0 -right-10 w-10 h-10" style={{
        background: '#f4f7fb',
        borderTopLeftRadius: '20px'
      }}/>
      <DatasetSideNavItem
        id='preview'
        icon='eye'
        label='Preview'
        to={pathToDatasetPreview(qriRef)}
        expanded={expanded}
        tooltip={
          <TooltipContent
            text='Preview'
            subtext='Explore the lastest version of this dataset'
          />
        }
      />
      <DatasetSideNavItem
        id='components'
        icon='history'
        label='History'
        to={pathToDatasetViewer(qriRef)}
        expanded={expanded}
        tooltip={
          <TooltipContent
            text='Components'
            subtext='Explore the lastest version of this dataset'
          />
        }
      />
      <DatasetSideNavItem
        id='workflow-editor'
        icon='code'
        label='Automation'
        to={pathToWorkflowEditor(qriRef.username, qriRef.name)}
        expanded={expanded}
        tooltip={
          <TooltipContent
            text='Workflow Editor'
            subtext='Automate updates to this dataset'
          />
        }
      />
      <DatasetSideNavItem
        id='activity-feed'
        icon='clock'
        label='Activity feed'
        to={pathToActivityFeed(qriRef.username, qriRef.name)}
        expanded={expanded}
        tooltip={
          <TooltipContent
            text='Activity Feed'
            subtext='Inspect recent job activity and updates'
          />
        }
      />
      {process.env.REACT_APP_FEATURE_WIREFRAMES &&
        <DatasetSideNavItem
          id='issues'
          icon='exclamationTriangle'
          label='Issues'
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
}

export default DatasetNavSidebar
