import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { clearModal } from './state/appActions'
import { AppModalType, selectModalType } from './state/appState'
import DeployWorkflowModal from '../workflow/modal/DeployWorkflowModal'
import ScheduleModal from '../workflow/ScheduleModal'

const Modal: React.FC<any> = () => {
  const type = useSelector(selectModalType)
  const dispatch = useDispatch()

  if (type === AppModalType.none) {
    return null
  }

  return (
    <div className='fixed z-10 inset-0 overflow-y-auto'>
      <div className='flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
        <div className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline'>
          <div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
            <div className='absolute top-2 right-4'>
              <button onClick={() => { dispatch(clearModal()) }}>x</button>
            </div>
            <div className='sm:flex sm:items-start'>
                {(() => {
                  switch (type) {
                    case AppModalType.schedulePicker:
                      return <ScheduleModal />
                    case AppModalType.deployWorkflow:
                        return <DeployWorkflowModal />
                    default:
                      return null
                  }
                })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal
