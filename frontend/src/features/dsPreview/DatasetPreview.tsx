import React from 'react'

import { QriRef } from '../../qri/ref'

export interface DatasetPreviewProps {
  qriRef: QriRef
}

const DatasetPreview: React.FC<DatasetPreviewProps> = ({
  qriRef
}) => {
  return (
    <h1 className='text-4xl'>Preview!</h1>
  )
}

export default DatasetPreview
