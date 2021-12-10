import React, { useCallback, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { ModalType, selectModal } from '../state/appState'
import RemoveDatasetModal, { RemoveDatasetModalProps } from '../../dataset/modal/RemoveDatasetModal'
import EditDatasetTitleModal, { EditDatasetTitleModalProps } from "../../dataset/modal/EditDatasetTitleModal"
import ScheduleModal from '../../workflow/modal/ScheduleModal'
import UnsavedChangesModal from '../../workflow/modal/UnsavedChangesModal'
import LogInModal from '../../session/modal/LogInModal'
import SignUpModal from '../../session/modal/SignUpModal'
import WorkflowSplashModal from '../../workflow/modal/SplashModal'
import DeployModal from '../../workflow/modal/DeployModal'
import AddTriggerModal from '../../trigger/modal/AddTriggerModal'
import NewDatasetModal from "../../dataset/modal/NewDatasetModal"

import { clearModal } from '../state/appActions'

const Modal: React.FC<any> = () => {
  const maskRef = useRef<HTMLDivElement>(null)
  const dispatch = useDispatch()
  const modal = useSelector(selectModal)

  const clearModalCallback = useCallback(() => {
    if (!modal.locked) {
      dispatch(clearModal())
    }
  }, [modal.locked, dispatch])

  const handleMaskClick = useCallback((e: MouseEvent) => {
    if (maskRef && maskRef.current?.contains(e.target as Element)) {
      clearModalCallback()
    }
  }, [maskRef, clearModalCallback])

  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.keyCode === 27) {
        clearModalCallback()
      }
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [clearModalCallback])

  useEffect(() => {
    document.addEventListener("mousedown", handleMaskClick)
    return () => {
      document.removeEventListener("mousedown", handleMaskClick)
    }
  }, [handleMaskClick])

  if (modal.type === ModalType.none) {
    return null
  }

  const modalPositionStyles = modal.position ? { position: modal.position.position, top: modal.position.top, left: modal.position.left } : {}

  return (
    <div className='fixed z-50 inset-0 overflow-y-auto'>
      <div className='flex items-center justify-center min-h-screen p-6 text-center sm:block sm:p-0 w-full'>
        <div ref={maskRef} className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"/>
        </div>

        <div
          style={{ ...modalPositionStyles }}
          className={`inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          {(() => {
            switch (modal.type) {
              case ModalType.schedulePicker:
                return <ScheduleModal {...modal.props} />
              case ModalType.unsavedChanges:
                return <UnsavedChangesModal {...modal.props} />
              case ModalType.removeDataset:
                return <RemoveDatasetModal {...modal.props as RemoveDatasetModalProps} />
              case ModalType.editDatasetTitle:
                return <EditDatasetTitleModal {...modal.props as EditDatasetTitleModalProps} />
              case ModalType.logIn:
                return <LogInModal {...modal.props} />
              case ModalType.signUp:
                return <SignUpModal {...modal.props} />
              case ModalType.workflowSplash:
                return <WorkflowSplashModal {...modal.props} />
              case ModalType.deploy:
                return <DeployModal {...modal.props} />
              case ModalType.addTrigger:
                return <AddTriggerModal {...modal.props} />
              case ModalType.newDataset:
                return <NewDatasetModal {...modal.props} />
              default:
                return null
            }
          })()}
        </div>
      </div>
    </div>
  )
}

export default Modal
