import React from 'react'
import { Link } from 'react-router-dom'
import { QriRef } from '../../../qri/ref'
import { pathToDatasetEditor } from '../../dataset/state/datasetPaths'

export interface NewVersionButtonProps {
  qriRef: QriRef
}

const NewVersionButton: React.FC<NewVersionButtonProps> = ({
  qriRef
}) => (
  <Link to={pathToDatasetEditor(qriRef)}>
    <div className='text-center border border-qriblue rounded-md py-3'>
      New Version
    </div>
  </Link>
)

export default NewVersionButton
