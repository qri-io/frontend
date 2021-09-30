import React from 'react'
import ModalLayout from '../../app/modal/ModalLayout'

interface UnsavedChangesModalProps {
  action: () => void
}

const ConfirmCellDelete: React.FC<UnsavedChangesModalProps> = ({ action }) => (
  <ModalLayout
    title='Are you sure you want to delete this cell?'
    type='warning'
    actionButtonText='Delete'
    cancelButtonText='Cancel'
    action={action}
  />
)

export default ConfirmCellDelete
