import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'

import EditableLabel from '../../chrome/EditableLabel'
import { renameDataset } from './state/datasetActions'
import DatasetInfoItem from './DatasetInfoItem'
import DownloadDatasetButton from '../download/DownloadDatasetButton'
import Link from '../../chrome/Link'
import { validateDatasetName } from '../session/state/formValidation'
import { selectDatasetHeader } from "./state/datasetState";
import { qriRefFromVersionInfo } from "../../qri/versionInfo";
import fileSize from "../../utils/fileSize";


export interface DatasetHeaderProps {
  border?: boolean
  editable?: boolean
  showInfo?: boolean
}

// DatasetHeader and DatasetMiniHeader now accept children which will be displayed
// in the right side where the default buttons are located. This is useful for
// overriding the download button with the dry run button in the workflow editor

const DatasetHeader: React.FC<DatasetHeaderProps> = ({
  border = false,
  editable = false,
  showInfo = true,
  children
}) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const header = useSelector(selectDatasetHeader)
  const qriRef = qriRefFromVersionInfo(header)


  const handleRename = (_:string, value:string) => {
    renameDataset(qriRef, { username: header.username, name: value })(dispatch)
      .then(({ type }) => {
        if (type === 'API_RENAME_SUCCESS') {
          const newPath = history.location.pathname.replace(header.name, value)
          history.replace(newPath)
        }
      })
  }

  return (
    <div className="w-full">
      <div className='flex mb-5'>
        <div className='flex-grow'>
          {/* don't show the username/name when creating a new dataset with the workflow editor */}
          { qriRef.username && (
            <div className='text-md text-gray-400 relative flex items-center group hover:text pb-1 font-mono h-10'>
              <Link to={`/${qriRef.username}`} className='whitespace-nowrap' colorClassName='text-qrigray-400 hover:text-qrigray-800'>{qriRef.username}</Link>/
              <EditableLabel
                readOnly={!editable}
                name='name'
                onChange={handleRename}
                value={qriRef.name}
                validator={validateDatasetName}
              />
            </div>
          )}

          <div className='text-2xl text-qrinavy-500 font-black group hover:text'>
            {header.name}
          </div>
          {showInfo && (
            <div className='flex mt-3 text-sm'>
              {header.workflowID && <DatasetInfoItem icon='automationFilled' label='automated' iconClassName='text-qrigreen' />}
              <DatasetInfoItem icon='disk' label={fileSize(header.bodySize || 0)} />
              <DatasetInfoItem icon='download' label={getLabel(header.downloadCount, 'download')} />
              <DatasetInfoItem icon='follower' label={getLabel(header.followerCount, 'follower')} />
              <DatasetInfoItem icon='globe' label='public' />
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
              <Button type='secondary'>
                <Icon icon='globe' size='lg' className='mr-2' /> Share
              </Button>
              <Icon icon='ellipsesVertical' size='lg' className='ml-2' />
              */}
              <DownloadDatasetButton qriRef={qriRef} type='primary' />
            </>
          )}
        </div>
      </div>
      {border && <div className='border-b-2' />}
    </div>
  )
}

export default DatasetHeader;

function getLabel(count: number, label: string) {
  return `${count} ${label}${count === 1 ? '' : 's'}`
}
