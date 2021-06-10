import React from 'react'

import Button, { ButtonType } from '../../chrome/Button'
import Icon from '../../chrome/Icon'
import { QriRef } from '../../qri/ref'

export interface DownloadDatasetButtonProps {
  qriRef: QriRef
  small?: boolean
  type?: ButtonType
}

const DownloadDatasetButton: React.FC<DownloadDatasetButtonProps> = ({
  qriRef,
  small=false,
  type='primary-outline'
}) => {
  return (
    <Button onClick={() => { alert(`unfinished: download ${qriRef.username}/${qriRef.name}`)}} type={type} size='sm'>
    {small ? <Icon icon='download' /> : 'Download'}
    </Button>
  )
}

export default DownloadDatasetButton
