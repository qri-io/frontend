import React from 'react'
import classNames from 'classnames'

import Link from '../../chrome/Link'
import DownloadDatasetButton from '../download/DownloadDatasetButton'
import { useSelector } from "react-redux"
import { selectDatasetHeader } from "./state/datasetState"
import { qriRefFromVersionInfo } from "../../qri/versionInfo"
import { newWorkflowTitle } from "./DatasetHeader"

export interface DatasetMiniHeaderProps {
  isNew: boolean
  show: boolean
}

// DatasetHeader and DatasetMiniHeader now accept children which will be displayed
// in the right side where the default buttons are located. This is useful for
// overriding the download button with the dry run button in the workflow editor

const DatasetMiniHeader: React.FC<DatasetMiniHeaderProps> = ({
  isNew,
  show,
  children
}) => {
  const header = useSelector(selectDatasetHeader)
  const qriRef = qriRefFromVersionInfo(header)

  return (
    <div className={classNames('sticky bg-white border border-qrigray-200 z-30 md:rounded-tl-3xl', {
      'invisible -top-16 h-0': !show,
      'visible top-0': show
    })} style={{
      transition: 'top 150ms cubic-bezier(0.4, 0, 0.2, 1)'
    }}>
      <div className='px-7 pt-4 pb-3 flex items-center z-10'>
        <div className='flex-grow'>
          { !isNew && (
            <div className='text-xs text-qrigray-400 font-mono'>
              <Link to={`/${qriRef.username}`} colorClassName='text-qrigray-400 hover:text-qrigray-800'>{qriRef.username || 'new'}</Link>/{qriRef.name}
            </div>
          )}
          <div className='text-normal text-black font-semibold'>
            {isNew ? newWorkflowTitle : header.name}
          </div>
        </div>

        <div className='flex items-center content-center'>
          {children || (
            <>
              {/*
                TODO(chriswhong): restore when these features are implemented
                <Button className='mr-3' type='dark'>
                  Follow
                </Button>
                <Button className='mr-3' type='secondary' icon='globe'>
                  Share
                </Button>
              */}
              <DownloadDatasetButton title='Download the full dataset version as a zip file' qriRef={qriRef} type='primary' small />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default DatasetMiniHeader
