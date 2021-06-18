import React from 'react'
import classNames from 'classnames'

import Button from '../../chrome/Button'
import TextLink from '../../chrome/TextLink'
import { Dataset, qriRefFromDataset } from '../../qri/dataset'
import Icon from '../../chrome/Icon'
import DownloadDatasetButton from '../download/DownloadDatasetButton'

export interface DatasetMiniHeaderProps {
  dataset: Dataset
  hide: boolean
}

// DatasetHeader and DatasetMiniHeader now accept children which will be displayed
// in the right side where the default buttons are located. This is useful for
// overriding the download button with the dry run button in the workflow editor


const DatasetMiniHeader: React.FC<DatasetMiniHeaderProps> = ({
  dataset,
  hide,
  children
}) => {
  const qriRef = qriRefFromDataset(dataset)
  return (
    <div className={classNames('sticky top-0 bg-white border border-qrigray-200 z-10', {
      'invisible -top-16 h-0': !hide,
      'visible top-0 transition-all': !hide
    })} style={{
      borderTopLeftRadius: '20px'
    }}>
      <div className='px-7 pt-4 pb-3 flex z-10'>
        <div className='flex-grow'>
          <div className='text-xs text-gray-400 font-mono'>
            <TextLink to={`/${dataset.peername}`} colorClassName='text-qrigray-400 hover:text-qrigray-800'>{dataset.peername || 'new'}</TextLink>/{dataset.name}
          </div>
          <div className='text-normal text-qrinavy font-semibold'>
            {dataset.meta?.title || dataset.name}
          </div>
        </div>
        <div className='flex items-center content-center'>
          {children || (
            <>
              <Button className='mr-3' type='light' filled={false}>
                Follow
              </Button>
              <Button className='mr-3' type='secondary'>
                <Icon icon='globe' size='lg' className='mr-2' /> Share
              </Button>
              <DownloadDatasetButton qriRef={qriRef} type='primary' small />
            </>
          )}
        </div>
      </div>
    </div>
  )
}


export default DatasetMiniHeader;