import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import classNames from 'classnames'

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
    // the monaco code components in CodeEditor are listening for 'resize' so they can
    // set their width.  A small delay is necessary here so that the CodeEditor resize
    // works properly after collapsing the dataset menu
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'))
    }, 5)
  }

  // determine if the workflow is new by reading /new at the end of the pathname
  const segments = useLocation().pathname.split('/')
  const isNewWorkflow = segments[segments.length - 1] === 'new'


  return (
    <div className={`side-nav pl-9 h-full bg-white relative pt-9 flex-shrink-0 ${expanded ? 'w-52' : 'w-24'}`}>
      <div className='mb-9 flex align-center items-center h-6'>
        <div
          className='text-gray-400 text-sm font-medium mr-4 leading-6 transition-all duration-700'
          style={{
            width: expanded ? 'auto' : 0,
            display: expanded ? 'block' : 'none'
          }}
        >
          DATASET MENU
        </div>
        <div
          className={classNames('cursor-pointer flex items-center w-6 transition duration-300 ease-in-out transform', {
            'hover:-translate-x-1': expanded,
            'hover:translate-x-1': !expanded,
          })}
          onClick={toggleExpanded}
        >
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
            subtext='View an overview of this Dataset'
          />
        }
        disabled={isNewWorkflow}
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
            subtext='Explore the version history of this Dataset'
          />
        }
        disabled={isNewWorkflow}
      />
      <DatasetSideNavItem
        id='workflow-editor'
        icon='code'
        label='Workflow'
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
        label='Run Log'
        to={pathToActivityFeed(qriRef.username, qriRef.name)}
        expanded={expanded}
        tooltip={
          <TooltipContent
            text='Activity Feed'
            subtext='Inspect recent job activity and updates'
          />
        }
        disabled={isNewWorkflow}
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
          disabled={isNewWorkflow}
        />
      }
    </div>
  )
}

export default DatasetNavSidebar
