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
  <li className='flex items-stretch'>
    <div className='relative w-4 mr-5 flex-shrink-0'>
      <div className='absolute top-5 w-4 h-4 border-2 border-qritile bg-transparent rounded-3xl'>&nbsp;</div>
      <div className='relative line-container w-0.5 mx-auto h-full'>
        <div className='absolute top-11 bottom-0 w-full bg-gray-300 rounded'>&nbsp;</div>
      </div>
    </div>
    <Link to={pathToDatasetEditor(qriRef)} className='mb-6 w-full'>
      <div className='text-center text-qritile text-sm font-medium tracking-wider border-2 border-qritile rounded-lg py-3 box-border'>
        New Version
      </div>
    </Link>
  </li>
)

export default NewVersionButton
