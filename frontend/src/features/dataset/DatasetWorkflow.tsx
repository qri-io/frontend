import React from 'react'

import { qriRefFromString } from '../../qri/ref';
import WorkflowEditor from '../workflow/WorkflowEditor';
import DatasetHeader from './DatasetHeader';

const DatasetWorkflow: React.FC<any> = () => {
  const ref = qriRefFromString('rgardaphe/presidents')

  return (
    <div>
      <DatasetHeader qriRef={ref} />
    </div>
  )
}

export default DatasetWorkflow;
