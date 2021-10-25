import React from 'react'
import { useDispatch } from 'react-redux'
import classNames from 'classnames'

import Button, { ButtonType } from '../../../chrome/Button'
import IconButton from '../../../chrome/IconButton'
import { clearModal } from '../state/appActions'

interface modalTypeConfig {
  actionButtonType: ButtonType
}

function typeSettings (type: ModalLayoutType): modalTypeConfig {
  switch (type) {
    case 'warning':
      return {
        actionButtonType: 'warning'
      }
    case 'danger':
      return {
        actionButtonType: 'danger'
      }
    default:
      return {
        actionButtonType: 'primary'
      }
  }
}

export type ModalLayoutType = 'info' | 'warning' | 'danger'

export interface ModalLayoutProps {
  title: string
  type?: ModalLayoutType
  icon?: string
  actionButtonText: string
  action?: () => void
  cancelButtonText?: string
}

const ModalLayout: React.FC<ModalLayoutProps> = ({
  title,
  type = 'info',
  actionButtonText,
  action,
  cancelButtonText = 'Cancel',
  children
}) => {
  const dispatch = useDispatch()

  const handleCancelButtonClick = () => {
    dispatch(clearModal())
  }

  const handleActionButtonClick = () => {
    action && action()
    dispatch(clearModal())
  }

  let { actionButtonType } = typeSettings(type)

  return (
    <>
      <div className='bg-white p-8'>
        <div>
          <div className='flex'>
            <div className='flex-grow'>
              <h3 className={classNames('text-2xl leading-6 font-black text-black mb-5', {
                'text-dangerred': type === 'danger'
              })}>{title}</h3>
            </div>
            <IconButton icon='close' onClick={handleCancelButtonClick} />
          </div>
          <div className="mb-5 text-base text-black">
            {children}
          </div>
        </div>
        <div>
          <Button
            type={actionButtonType}
            onClick={handleActionButtonClick}
            id='modal_layout_action_button'
            size='lg'
          >
            {actionButtonText}
          </Button>
          <Button
            type='light'
            onClick={handleCancelButtonClick}
            className='ml-4'
            size='lg'
          >
            {cancelButtonText}
          </Button>
        </div>
      </div>

    </>
  )
}

export default ModalLayout
