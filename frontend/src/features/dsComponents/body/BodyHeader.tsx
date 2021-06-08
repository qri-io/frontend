import React from 'react'
import numeral from 'numeral'

import Dataset, { Structure, schemaToColumns, ColumnProperties, extractColumnHeaders } from '../../../qri/dataset'
import Icon from '../../../chrome/Icon'
import IconLink from '../../../chrome/IconLink'

interface BodyHeaderProps {
  data: Dataset
  onToggleExpanded?: () => void
  showExpand?: boolean
}

const Body: React.FC<BodyHeaderProps> = ({
  data,
  onToggleExpanded,
  showExpand = true
}) => {
  const { structure, body } = data
  const headers = extractColumnHeaders(structure, body)

  return (
    <div className='flex'>
      <div className='flex flex-grow text-sm text-qrigray-400'>
        <div className='mr-4 flex items-center'>
          <Icon icon='rows' size='2xs' className='mr-1'/> {numeral(structure.entries).format('0,0')} rows
        </div>
        <div className='mr-4 flex items-center'>
          <Icon icon='columns' size='2xs' className='mr-1'/> {numeral(headers.length).format('0,0')} columns
        </div>
      </div>
      {showExpand && <IconLink icon='fullScreen' onClick={onToggleExpanded} />}
    </div>
  )
}

export default Body
