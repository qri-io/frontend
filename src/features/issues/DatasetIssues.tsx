import React from 'react'

import { QriRef } from '../../qri/ref'
import DatasetFixedLayout from '../dataset/DatasetFixedLayout'

export interface DatasetIssuesProps {
  qriRef: QriRef
}

const DatasetIssues: React.FC<DatasetIssuesProps> = ({ qriRef }) => {
  return (
    <DatasetFixedLayout>
      <h1 className='text-2xl'>Issues</h1>
    </DatasetFixedLayout>

  )
}

export default DatasetIssues
