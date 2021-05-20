import React from 'react'

import Button from '../../chrome/Button'
import Icon from '../../chrome/Icon'
import { QriRef } from '../../qri/ref'

export interface DownloadDatasetButtonProps {
  qriRef: QriRef
  small?: boolean
}

const DownloadDatasetButton: React.FC<DownloadDatasetButtonProps> = ({
  qriRef,
  small=false
}) => {
  return (
    <Button onClick={() => { alert(`unfinished: download ${qriRef.username}/${qriRef.name}`)}} type='primary-outline' size='sm'>
    {!small && 'Download'}
    {small && (
      <Icon icon='download' />
    )}
    </Button>
  )
}

export default DownloadDatasetButton
