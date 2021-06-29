import React from 'react'
import { useDispatch } from 'react-redux'
import { AnyAction } from 'redux'
import { removeDataset } from '../state/datasetActions'
import { loadCollection } from '../../collection/state/collectionActions'

import ModalLayout from '../../app/modal/ModalLayout'

export interface RemoveDatasetModalProps {
  username: string,
  name: string
}

const RemoveDatasetModal: React.FC<RemoveDatasetModalProps> = ({ username, name }) => {
  const dispatch = useDispatch()

  const onRemove = () => {
    // TODO (ramfox): we are thinking of ways to adjust this syntax: https://github.com/qri-io/qrimatic/issues/98
    removeDataset({username, name})(dispatch)
      .then((action: AnyAction) => {
        if (action.type.includes('SUCCESS')) {
          dispatch(loadCollection())
          return
        }
        // TODO (ramfox): when we add in toasts, this should be replaced with a
        // error/failure toast
        alert(`error removing dataset: ${action.payload.err.message}`)
      })
  }

  return (
    <ModalLayout
      title='Remove Dataset'
      type='danger'
      actionButtonText='I understand, remove it'
      action={onRemove}
    >
      <p className='mb-4'>Are you sure you want to remove the dataset <span className='font-semibold'>{username}/{name}</span>?</p>
      <p>This action cannot be undone.</p>
    </ModalLayout>
  )
}

export default RemoveDatasetModal
