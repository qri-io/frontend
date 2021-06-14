import React from 'react'
import { useDispatch } from 'react-redux'

import Icon from '../../../chrome/Icon'
import Button, { ButtonType } from '../../../chrome/Button'
import { clearModal } from '../state/appActions'

export type ModalLayoutType = 'info' | 'warning' | 'danger'

export interface ModalLayoutProps {
  title: string
  type?: ModalLayoutType
  icon?: string
  actionButtonText: string
  action: () => void
  cancelButtonText?: string
}

const ModalLayout: React.FC<ModalLayoutProps> = ({
  title,
  type='info',
  icon,
  actionButtonText,
  action,
  cancelButtonText='Cancel',
  children
}) => {
  const dispatch = useDispatch()

  const handleCancelButtonClick = () => {
    dispatch(clearModal())
  }

  const handleActionButtonClick = () => {
    action()
    dispatch(clearModal())
  }

  let { displayIcon, actionButtonType, iconBgColorClass, iconColorClass } = typeSettings(type)

  return (
    <>
      <div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
        <div className='sm:flex sm:items-start'>
          <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 ${iconBgColorClass}`}>
            <Icon icon={icon || displayIcon} className={iconColorClass} />
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
        <Button
          type={actionButtonType}
          onClick={handleActionButtonClick}
        >
          {actionButtonText}
        </Button>
        <Button
          type='light'
          onClick={handleCancelButtonClick}
          className='mr-2'
        >
         {cancelButtonText}
        </Button>
      </div>
    </>
  )
}

interface modalTypeConfig {
  displayIcon: string
  actionButtonType: ButtonType
  iconBgColorClass: string
  iconColorClass: string
}

function typeSettings(type: ModalLayoutType): modalTypeConfig {
  switch (type) {
    case 'warning':
      return {
        actionButtonType: 'warning',
        displayIcon: 'exclamationTriangle',
        iconBgColorClass: 'bg-yellow-100',
        iconColorClass: 'text-yellow-400'
      }
   case 'danger':
     return {
        actionButtonType: 'danger',
        displayIcon: 'exclamationTriangle',
        iconBgColorClass: 'bg-red-100',
        iconColorClass: 'text-red-600'
     }
   default:
     return {
        displayIcon: 'info',
        actionButtonType: 'primary',
        iconBgColorClass: 'bg-qriblue-100',
        iconColorClass: 'text-qriblue-600'
     }
  }

}

export default ModalLayout