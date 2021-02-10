import React from 'react'

import ModalLayout from '../../app/ModalLayout'

const RemoveDatasetModal: React.FC = () => {
  return (
    <ModalLayout
      title='Remove Dataset'
      type='danger'
      actionButtonText='I understand, remove it'
      action={() => { alert('REMOVE DATASET') }}
    >
      <p className='mb-4'>Are you sure you want to remove the dataset <span className='font-semibold'>chriswhong/nyc-turnstile-counts-2020</span>?</p>
      <p>This action cannot be undone.</p>
    </ModalLayout>
  )
}

export default RemoveDatasetModal
