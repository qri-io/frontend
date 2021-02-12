import React from 'react'
import { useDispatch } from 'react-redux'

import Icon from '../../../chrome/Icon'
import { clearModal } from '../state/appActions'


export interface ModalLayoutProps {
  title: string
  type?: 'info' | 'danger' 
  icon?: string
  actionButtonText: string
  action: () => void
}

const ModalLayout: React.FC<ModalLayoutProps> = (props) => {
  const {
    title,
    type='info',
    icon=undefined,
    actionButtonText,
    action,
    children
  } = props

  const dispatch = useDispatch()

  const handleCancelButtonClick = () => {
    dispatch(clearModal())
  }

  const handleActionButtonClick = () => {
    action()
    dispatch(clearModal())
  }

  let actionButtonColorClass = 'bg-qriblue-600 hover:bg-qriblue-700 focus:ring-qriblue-500'
  let displayIcon = 'info'
  let iconBgColorClass = 'bg-qriblue-100'
  let iconColorClass = 'text-qriblue-600'

  if (type === 'danger') {
    actionButtonColorClass = 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
    displayIcon = 'exclamationTriangle'
    iconBgColorClass = 'bg-red-100'
    iconColorClass = 'text-red-600'
  }

  // allow icon override
  if (icon) displayIcon = icon

  return (
    <>
      <div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
        <div className='sm:flex sm:items-start'>
          <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 ${iconBgColorClass}`}>
            <Icon icon={displayIcon} className={`${iconColorClass}`} />
          </div>
          <div className="mt-3 sm:mt-0 sm:ml-4 sm:text-left">
            <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
            <div className="mt-2 text-sm text-gray-500">
              {children}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <button
          type="button"
          className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2  sm:ml-3 sm:w-auto sm:text-sm ${actionButtonColorClass}`}
          onClick={handleActionButtonClick}
        >
          {actionButtonText}
        </button>
        <button
          type="button"
          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          onClick={handleCancelButtonClick}
        >
        Cancel
        </button>
      </div>
    </>
  )
}

export default ModalLayout
