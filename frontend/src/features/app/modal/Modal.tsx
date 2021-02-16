import React, { useCallback, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { ModalType, selectModal } from '../state/appState'
import DeployWorkflowModal from '../../deploy/DeployWorkflowModal'
import RemoveDatasetModal, { RemoveDatasetModalProps } from '../../dataset/modal/RemoveDatasetModal'
import ScheduleModal from '../../workflow/modal/ScheduleModal'
import LogInModal from './LogInModal'
import SignUpModal from './SignUpModal'

import { clearModal } from '../state/appActions'

const Modal: React.FC<any> = () => {
  const maskRef = useRef<HTMLDivElement>(null)
  const dispatch = useDispatch()
  const modal = useSelector(selectModal)

  const handleMaskClick = useCallback((e: MouseEvent) => {
    if (maskRef && maskRef.current?.contains(e.target as Element)) {
      dispatch(clearModal())
    }
  }, [dispatch, maskRef])


  useEffect(() => {
    document.addEventListener("mousedown", handleMaskClick)
    return () => {
      document.removeEventListener("mousedown", handleMaskClick)
    }
  }, [handleMaskClick])

  if (modal.type === ModalType.none) {
    return null
  }

  return (
    <div className='fixed z-10 inset-0 overflow-y-auto'>
      <div className='flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
      <div ref={maskRef} className="fixed inset-0 transition-opacity" aria-hidden="true">
        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

        <div className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline'>
            {(() => {
              switch (modal.type) {
                case ModalType.schedulePicker:
                  return <ScheduleModal {...modal.props} />
                case ModalType.deployWorkflow:
                    return <DeployWorkflowModal {...modal.props} />
                case ModalType.removeDataset:
                    return <RemoveDatasetModal {...modal.props as RemoveDatasetModalProps} />
                case ModalType.logIn:
                    return <LogInModal {...modal.props} />
                case ModalType.signUp:
                    return <SignUpModal {...modal.props} />
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
