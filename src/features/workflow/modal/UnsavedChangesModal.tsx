import React from 'react'
import ModalLayout from '../../app/modal/ModalLayout'

interface UnsavedChangesModalProps {
  action?: () => void
}

const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({ action }) => (
  <ModalLayout
    title='This Workflow has undeployed changes'
    type='warning'
    actionButtonText='Discard Changes'
    cancelButtonText='Stay'
    action={action}
  >
    <p className='mb-4'>It looks like you&apos;ve made changes to this workflow that have not been deployed.  These changes will be lost if you leave this page. </p>
  </ModalLayout>
)

export default UnsavedChangesModal
