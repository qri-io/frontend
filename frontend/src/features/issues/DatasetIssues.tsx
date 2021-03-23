import React from 'react'

import { QriRef } from '../../qri/ref'

export interface DatasetIssuesProps {
  qriRef: QriRef
}

const DatasetIssues: React.FC<DatasetIssuesProps> = ({ qriRef }) => {
  return (
    <h1 className='text-2xl'>Issues</h1>
  )
}

export default DatasetIssues
