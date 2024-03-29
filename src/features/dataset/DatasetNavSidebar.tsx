import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import classNames from 'classnames'

import { QriRef } from '../../qri/ref'
import DatasetSideNavItem from './DatasetSideNavItem'
import TooltipContent from '../../chrome/TooltipContent'
import NewDatasetButton from '../../chrome/NewDatasetButton'
import Icon from '../../chrome/Icon'
import {
  pathToWorkflowEditor,
  pathToDatasetHistory,
  pathToDatasetIssues,
  pathToDatasetPreview,
  pathToDatasetRuns
} from './state/datasetPaths'

import { selectNavExpanded } from '../app/state/appState'
import { toggleNavExpanded } from '../app/state/appActions'
import {
  selectRunCount,
  selectCommitCount,
  selectSessionUserCanEditDataset
} from "./state/datasetState"
import { selectWorkflow } from "../workflow/state/workflowState"

export interface DatasetNavSidebarProps {
  qriRef: QriRef
  editor: boolean
}

const DatasetNavSidebar: React.FC<DatasetNavSidebarProps> = ({
  qriRef,
  editor = false
}) => {
  const expanded = useSelector(selectNavExpanded)
  const versionCount = useSelector(selectCommitCount)
  const logCount = useSelector(selectRunCount)
  const workflow = useSelector(selectWorkflow)
  const canEdit = useSelector(selectSessionUserCanEditDataset)
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
    <div className={`hidden md:flex side-nav h-full bg-white relative py-9 flex-col flex-shrink-0 ${expanded ? 'w-44' : 'w-24'}`}>
      <div className='mb-9 flex align-center items-center h-6 mx-auto'>
        <div
          className='text-qrigray-300 text-sm font-medium mr-3 leading-6 transition-all duration-700'
          style={{
            width: expanded ? 'auto' : 0,
            display: expanded ? 'block' : 'none',
            fontSize: 12
          }}
        >
          DATASET MENU
        </div>
        <div
          className={classNames('cursor-pointer flex items-center w-6 transition duration-300 ease-in-out transform', {
            'hover:-translate-x-1': expanded,
            'hover:translate-x-1': !expanded
          })}
          onClick={toggleExpanded}
        >
          <Icon className='m-auto' icon={expanded ? 'caretLeft' : 'caretRight'} size='xs' />
        </div>
      </div>
      <div className={`flex-grow mx-auto`}>
        <DatasetSideNavItem
          id='preview'
          icon='eye'
          label='Preview'
          to={pathToDatasetPreview(qriRef)}
          exact
          expanded={expanded}
          tooltip={
            <TooltipContent
              text='Preview'
              subtext='See an overview of this Dataset'
            />
          }
          disabled={isNewWorkflow || editor}
        />
        <DatasetSideNavItem
          id='components'
          icon='history'
          label='History'
          to={pathToDatasetHistory(qriRef)}
          expanded={expanded}
          number={versionCount}
          tooltip={
            <TooltipContent
              text='History'
              subtext='Explore the version history of this Dataset'
            />
          }
          disabled={isNewWorkflow || editor}
        />
        <DatasetSideNavItem
          id='workflow-editor'
          icon='code'
          label='Automation'
          isLink={!isNewWorkflow}
          to={pathToWorkflowEditor(qriRef.username, qriRef.name)}
          expanded={expanded}
          disabled={!canEdit || editor}
          tooltip={
            <TooltipContent
              text='Automation'
              subtext='Write code to keep this Dataset fresh'
            />
          }
        />
        <DatasetSideNavItem
          id='activity-feed'
          icon='clock'
          label='Run Log'
          to={pathToDatasetRuns(qriRef.username, qriRef.name)}
          expanded={expanded}
          number={logCount}
          tooltip={
            <TooltipContent
              text='Run Log'
              subtext='Inspect recent job activity and updates'
            />
          }
          disabled={isNewWorkflow || !workflow.id.length || editor}
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
            disabled={isNewWorkflow || editor}
          />
        }
      </div>
      <div className='text-center'>
        {!isNewWorkflow && <NewDatasetButton id='sidebar-new-dataset-button' mini={!expanded} />}
      </div>
    </div>
  )
}

export default DatasetNavSidebar
