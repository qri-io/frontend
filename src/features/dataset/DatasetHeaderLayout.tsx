// rendering component for dataset headers
// this was split from `DatasetHeader` which contains all of the selectors and actions for
// working with the 'active dataset'.  This component is used directly by DatasetEditorLayout
// elsewhere it is downstream of DatasetHeader
import React from 'react'
import ContentLoader from "react-content-loader"

import EditableLabel from '../../chrome/EditableLabel'
import DatasetInfoItem from './DatasetInfoItem'
import Link from '../../chrome/Link'
import { validateDatasetName } from '../session/state/formValidation'
import Icon from "../../chrome/Icon"

import { VersionInfo } from "../../qri/versionInfo"
import { QriRef } from "../../qri/ref"
import fileSize from "../../utils/fileSize"

function getLabel (count: number, label: string) {
  return `${count} ${label}${count === 1 ? '' : 's'}`
}

export interface DatasetHeaderLayoutProps {
  // contains the username and dataset name
  qriRef: QriRef
  // contains the title
  header: VersionInfo
  // shows loading state
  headerLoading?: boolean
  // whether to show a bottom border
  border?: boolean
  // allows editing the name, which will call onNameChange
  nameEditable?: boolean
  // fires when the user renames the dataset
  onNameChange?: (_: string, value: string) => void
  // allows editing the title, which will call onTitleChange
  titleEditable?: boolean
  // fires when the user changes the dataset title
  onTitleChange?: (_: string, value: string) => void
  // whether the user can edit the dataset
  userCanEditDataset?: boolean
  // whether editable inputs should show their outlines
  showInputOutlines?: boolean
}

const DatasetHeaderLayout: React.FC<DatasetHeaderLayoutProps> = ({
  qriRef,
  header,
  headerLoading = false,
  border = false,
  nameEditable = false,
  onNameChange,
  titleEditable = false,
  onTitleChange,
  userCanEditDataset,
  showInputOutlines = false,
  children
}) => (
  <div className="w-full">
    <div className='flex mb-5'>
      <div className='flex-grow'>
        <div className='text-base text-qrigray-400 relative flex items-center group hover:text font-mono mb-1'>
          {headerLoading
            ? <ContentLoader height='20.8'>
              <rect width="100" y='4' height="16" rx="1" fill="#D5DADD"/>
              <rect width="180" y='4' x='110' height="16" rx="1" fill="#D5DADD"/>
            </ContentLoader>
            : <>
              <Link to={`/${qriRef.username}`} className='whitespace-nowrap' colorClassName='text-qrigray-400 hover:text-qrigray-800'>{qriRef.username}</Link><span className='ml-1'>/</span>
              <EditableLabel
                  readOnly={!nameEditable}
                  name='name'
                  onChange={onNameChange}
                  value={qriRef.name}
                  validator={validateDatasetName}
                />
            </>}
        </div>
        {(headerLoading)
          ? <ContentLoader height='29.6'>
            <rect width="320" y='5' height="20" rx="1" fill="#D5DADD"/>
          </ContentLoader>
          : <div className='flex items-center group hover:text'>
            <EditableLabel
              readOnly={!titleEditable}
              name='title'
              onChange={onTitleChange}
              textClassName='text-2xl font-bold'
              value={header?.metaTitle || header?.name}
              placeholder='Enter a Title for your dataset'
              size='lg'
              showOutline={showInputOutlines}
            />
            {
              userCanEditDataset && <Link to={`/${qriRef.username}/${qriRef.name}/edit#meta`}><Icon size='sm' className='text-qrigray-300 ml-4 opacity-0 group-hover:opacity-100 transition-opacity' icon='edit' /></Link>
            }
          </div>
          }
        {(!!header.runID || !!header.bodySize || !!header.downloadCount || !!header.followerCount) && (
        <div className='flex mt-2 text-sm'>
          {header.runID && <DatasetInfoItem icon='automationFilled' label='automated' iconClassName='text-qrigreen' />}
          <DatasetInfoItem size='lg' icon='disk' label={fileSize(header.bodySize || 0)} />
          <DatasetInfoItem size='lg' icon='download' label={getLabel(header.downloadCount, 'download')} />
          <DatasetInfoItem size='lg' icon='follower' label={getLabel(header.followerCount, 'follower')} />
          <DatasetInfoItem size='lg' icon='unlock' label='public' />
        </div>
        )}
      </div>
      <div className='flex items-center justify-end pl-6' style={{ minWidth: 295 }}>
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

export default DatasetHeaderLayout
