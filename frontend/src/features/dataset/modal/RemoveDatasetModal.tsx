import React from 'react'
import { useDispatch } from 'react-redux'
import { AnyAction } from 'redux'
import { removeDataset } from '../state/datasetActions'
import { loadDatasets } from '../../collection/state/collectionActions'

import ModalLayout from '../../app/modal/ModalLayout'

export interface RemoveDatasetModalProps {
  username: string,
  name: string
}

const RemoveDatasetModal: React.FC<RemoveDatasetModalProps> = ({ username, name }) => {
  const dispatch = useDispatch()

  const onRemove = () => {
    // TODO (ramfox): because of the way that `ApiActionThunk` is composed, this is
    // the only way to get to the underlying `Promise`
    // it's pretty odd syntax, and it makes me think that perhaps our types
    // aren't composed in the most optimal way
    // the dream would be to use this pattern: `dispatch(someAction()).then(() => dispatch(someOtherAction())).catch((failure) => doSomethingWith(failure))`
    removeDataset({username, name})(dispatch)
      .then((action: AnyAction) => {
        if (action.type.includes('SUCCESS')) {
          dispatch(loadDatasets())
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
