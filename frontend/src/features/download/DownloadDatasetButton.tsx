import React from 'react'

import Button from '../../chrome/Button'
import { QriRef } from '../../qri/ref'

export interface DownloadDatasetButtonProps {
  qriRef: QriRef
}

const DownloadDatasetButton: React.FC<DownloadDatasetButtonProps> = ({
  qriRef
}) => {
  return (
    <Button onClick={() => { alert(`unfinished: download ${qriRef.username}/${qriRef.name}`)}}>Download</Button>
  )
}

export default DownloadDatasetButton
