import React, { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import ContentLoader from "react-content-loader"

import EditableLabel from '../../chrome/EditableLabel'
import {
  commitDatasetTitle,
  loadDataset,
  resetDatasetTitleError,
  renameDataset
} from './state/datasetActions'
import DatasetInfoItem from './DatasetInfoItem'
import Link from '../../chrome/Link'
import { validateDatasetName } from '../session/state/formValidation'
import {
  selectDataset,
  selectDatasetHeader,
  selectIsDatasetLoading,
  selectIsHeaderLoading
} from "./state/datasetState"
import { qriRefFromVersionInfo } from "../../qri/versionInfo"
import fileSize from "../../utils/fileSize"
import { newQriRef } from "../../qri/ref"
import { loadDatasetCommits } from "../commits/state/commitActions"
import classNames from "classnames"
import Icon from "../../chrome/Icon"
import { clearModal, showModal } from "../app/state/appActions"
import { ModalType, selectNavExpanded } from "../app/state/appState"

export interface DatasetHeaderProps {
  isNew: boolean
  border?: boolean
  editable?: boolean
}

export const newWorkflowTitle: string = 'New Dataset from Workflow'
// DatasetHeader and DatasetMiniHeader now accept children which will be displayed
// in the right side where the default buttons are located. This is useful for
// overriding the download button with the dry run button in the workflow editor

const DatasetHeader: React.FC<DatasetHeaderProps> = ({
  isNew,
  border = false,
  editable = false,
  children
}) => {
  const dispatch = useDispatch()
  const history = useHistory()
  // const location = useLocation()
  const isExpanded = useSelector(selectNavExpanded)
  const header = useSelector(selectDatasetHeader)
  const dataset = useSelector(selectDataset)
  const headerLoading = useSelector(selectIsHeaderLoading)
  const datasetLoading = useSelector(selectIsDatasetLoading)
  const qriRef = qriRefFromVersionInfo(header)
  const [ titleChangePosition, setTitleModalPosition ] = useState({ top: '0', left: '0' })
  const measuredRef = useCallback(node => {
    if (node !== null) {
      const left: string = `${node.getBoundingClientRect().left - 25.5}px`
      const top: string = `${node.getBoundingClientRect().top - 55.5}px`
      setTitleModalPosition({ top, left })
    }
  }, [ isExpanded ])

  const handleRename = (_: string, value: string) => {
    renameDataset(qriRef, { username: header.username, name: value })(dispatch)
      .then(({ type }) => {
        if (type === 'API_RENAME_SUCCESS') {
          const newPath = history.location.pathname.replace(header.name, value)
          history.replace(newPath)
        }
      })
  }

  const handleTitleChange = (title: string, commitTitle: string) => {
    commitDatasetTitle(qriRef, title, commitTitle)(dispatch)
      .then(({ type }) => {
        if (type === 'API_TITLE_SUCCESS') {
          const ref = newQriRef({ username: qriRef.username, name: qriRef.name })
          loadDataset(ref)(dispatch).then(({ type }) => {
            if (type === 'API_DATASET_SUCCESS') {
              dispatch(clearModal())
            }
          })
          dispatch(loadDatasetCommits(ref))
        }
      })
  }

  const onTitleClick = () => {
    if (!isNew) {
      dispatch(resetDatasetTitleError())
      dispatch(showModal(ModalType.editDatasetTitle, {
        title: dataset.meta?.title ? dataset.meta?.title : header.name,
        onCommit: handleTitleChange
      }, true, { top: titleChangePosition.top.toString(), left: titleChangePosition.left.toString(), position: 'absolute' }))
    }
  }

  return (
    <div className="w-full">
      <div className='flex mb-5'>
        <div className='flex-grow'>
          {/* don't show the username/name when creating a new dataset with the workflow editor */}
          { !isNew && (
            <div className='text-base text-qrigray-400 relative flex items-center group hover:text font-mono'>
              {headerLoading
                ? <ContentLoader height='20.8'>
                  <rect width="100" y='4' height="16" rx="1" fill="#D5DADD"/>
                  <rect width="180" y='4' x='110' height="16" rx="1" fill="#D5DADD"/>
                </ContentLoader>
                : <>
                  <Link to={`/${qriRef.username}`} className='whitespace-nowrap' colorClassName='text-qrigray-400 hover:text-qrigray-800'>{qriRef.username}</Link>/
                  <EditableLabel
                    readOnly={!editable}
                    name='name'
                    onChange={handleRename}
                    value={qriRef.name}
                    validator={validateDatasetName}
                  />
                </>}
            </div>
          )}

          {(headerLoading || datasetLoading) && !isNew
            ? <ContentLoader height='29.6'>
              <rect width="320" y='5' height="20" rx="1" fill="#D5DADD"/>
            </ContentLoader>
            : <div ref={measuredRef} onClick={onTitleClick} className={classNames({ 'cursor-pointer whitespace-nowrap': !isNew }, 'flex items-center group hover:text')}>
              <h3 className='text-2xl font-bold'>{isNew ? newWorkflowTitle : dataset.meta?.title ? dataset.meta?.title : header.name}</h3>
              {
                editable && <Icon size='sm' className='text-qrigray-300 ml-4 opacity-0 group-hover:opacity-100 transition-opacity' icon='edit' />
              }
            </div>
          }
          {!isNew && (
            <div className='flex mt-2 text-sm'>
              {header.runID && <DatasetInfoItem icon='automationFilled' label='automated' iconClassName='text-qrigreen' />}
              <DatasetInfoItem size='lg' icon='disk' label={fileSize(header.bodySize || 0)} />
              <DatasetInfoItem size='lg' icon='download' label={getLabel(header.downloadCount, 'download')} />
              <DatasetInfoItem size='lg' icon='follower' label={getLabel(header.followerCount, 'follower')} />
              <DatasetInfoItem size='lg' icon='unlock' label='public' />
            </div>
          )}
        </div>
        <div className='flex items-center content-center pl-6'>
          {children || (
            <>
              {/*
                TODO(chriswhong) - Reinstate Share and Follow buttons when these features are available
              <Button className='mr-3' type='dark'>
                Follow
              </Button>
              <Button type='secondary icon='globe'>
                Share
              </Button>
              <Icon icon='ellipsesVertical' size='lg' className='ml-2' />
              */}
              {/* <DownloadDatasetButton qriRef={qriRef} type='primary' /> */}
            </>
          )}
        </div>
      </div>
      {border && <div className='border-b-2' />}
    </div>
  )
}

export default DatasetHeader

function getLabel (count: number, label: string) {
  return `${count} ${label}${count === 1 ? '' : 's'}`
}
