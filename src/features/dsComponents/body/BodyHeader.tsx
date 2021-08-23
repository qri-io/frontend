import React from 'react'
import numeral from 'numeral'

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
}

const BodyHeader: React.FC<BodyHeaderProps> = ({
  dataset,
  onToggleExpanded,
  showExpand = true,
  showDownload = true
}) => {
  const { structure, body } = dataset
  const headers = extractColumnHeaders(structure, body)

  return (
    <div className='flex'>
      <div className='flex flex-grow text-sm text-qrigray-400'>
        <div className='mr-4 flex items-center'>
          <Icon icon='rows' size='2xs' className='mr-1'/> {numeral(structure?.entries).format('0,0')} rows
        </div>
        <div className='mr-4 flex items-center'>
          <Icon icon='columns' size='2xs' className='mr-1'/> {numeral(headers.length).format('0,0')} columns
        </div>
      </div>
      {showDownload && <DownloadDatasetButton qriRef={qriRefFromDataset(dataset)} asIconLink body />}
      {showExpand && <IconLink icon='fullScreen' onClick={onToggleExpanded} />}
    </div>
  )
}

export default BodyHeader
