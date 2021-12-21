import React from 'react'
import classNames from 'classnames'

import Link from '../../chrome/Link'
import DownloadDatasetButton from '../download/DownloadDatasetButton'
import { VersionInfo } from "../../qri/versionInfo"
import { QriRef } from "../../qri/ref"

export interface DatasetMiniHeaderProps {
  // contains the username and dataset name
  qriRef: QriRef
  // contains the title
  header: VersionInfo
  // whether the mini header is visible
  show: boolean
}

const DatasetMiniHeader: React.FC<DatasetMiniHeaderProps> = ({
  qriRef,
  header,
  show,
  children
}) => (
  <div className={classNames('sticky bg-white border border-qrigray-200 z-30 md:rounded-tl-3xl', {
    'invisible -top-16 h-0': !show,
    'visible top-0': show
  })} style={{
    transition: 'top 150ms cubic-bezier(0.4, 0, 0.2, 1)'
  }}>
    <div className='px-7 pt-4 pb-3 flex items-center z-10'>
      <div className='flex-grow'>
        <div className='text-xs text-qrigray-400 font-mono'>
          <Link to={`/${qriRef.username}`} colorClassName='text-qrigray-400 hover:text-qrigray-800'>{qriRef.username || 'new'}</Link>/{qriRef.name}
        </div>
        <div className='text-normal text-black font-semibold'>
          {header.metaTitle || header.name}
        </div>
      </div>

      <div className='flex items-center content-center'>
        {children || (
        <>
          <DownloadDatasetButton title='Download this version' qriRef={qriRef} type='primary' small />
        </>
        )}
      </div>
    </div>
  </div>
)

export default DatasetMiniHeader
