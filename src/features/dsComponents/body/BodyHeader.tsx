import React from 'react'
import numeral from 'numeral'
import ContentLoader from 'react-content-loader'

import Dataset, {
  qriRefFromDataset,
  extractColumnHeaders
} from '../../../qri/dataset'
import Icon from '../../../chrome/Icon'
import IconLink from '../../../chrome/IconLink'
import DownloadDatasetButton from '../../download/DownloadDatasetButton'

interface BodyHeaderProps {
  dataset: Dataset
  showExpand?: boolean
  showDownload?: boolean
  onToggleExpanded?: () => void
  loading: boolean
  isPreview?: boolean
}

const BodyHeader: React.FC<BodyHeaderProps> = ({
  dataset,
  onToggleExpanded,
  showExpand = true,
  showDownload = true,
  loading,
  isPreview = false
}) => {
  const { structure, body } = dataset
  const headers = extractColumnHeaders(structure, body)
  const entries = numeral(structure?.entries).format('0,0')

  return (
    <div className='flex'>
      <div className='flex flex-grow text-qrigray-400' style={{ fontSize: 12 }}>
        <div className='mr-4 flex items-center'>
          <Icon icon='rows' size='2xs' className='mr-1'/>
          {loading
            ? <ContentLoader height='13' width='117'>
              <rect y='0' x='1' width="95" height="12" fill="#D5DADD"/>
            </ContentLoader>
            : <>
              {isPreview ? 'Previewing 100 of' : 'Showing all'} {entries} row{structure && structure.entries > 0 && 's'}
            </>}
        </div>
        <div className='body_header_columns_text mr-4 flex items-center'>
          <Icon icon='columns' size='2xs' className='mr-1'/>
          {loading
            ? <ContentLoader height='13' width='117'>
              <rect y='0' x='1' width="95" height="12" fill="#D5DADD"/>
            </ContentLoader>
            : <>
              {numeral(headers.length).format('0,0')} columns
            </>}
        </div>
      </div>
      {showDownload && <DownloadDatasetButton title="Download data" qriRef={qriRefFromDataset(dataset)} asIconLink body />}
      {showExpand && <IconLink icon='fullScreen' onClick={onToggleExpanded} />}
    </div>
  )
}

export default BodyHeader
