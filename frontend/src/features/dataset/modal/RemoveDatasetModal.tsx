import React from 'react'

import ModalLayout from '../../app/modal/ModalLayout'

export interface RemoveDatasetModalProps {
  username: string,
  name: string
}

const RemoveDatasetModal: React.FC<RemoveDatasetModalProps> = ({ username, name }) => {
  return (
    <ModalLayout
      title='Remove Dataset'
      type='danger'
      actionButtonText='I understand, remove it'
      action={() => { alert('REMOVE DATASET') }}
    >
      <p className='mb-4'>Are you sure you want to remove the dataset <span className='font-semibold'>{username}/{name}</span>?</p>
      <p>This action cannot be undone.</p>
    </ModalLayout>
  )
}

export default RemoveDatasetModal
