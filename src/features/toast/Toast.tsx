import React from 'react'
import classNames from 'classnames'
import RunStatusIcon from '../run/RunStatusIcon'
import IconButton from '../../chrome/IconButton'

interface ToastProps {
  message: string
  type: 'running' | 'succeeded' | 'failed'
}


const Toast: React.FC<ToastProps> = ({ message, type }) => {
  return (
    <div className='flex items-center'>
      <div className='px-3'>
        {['running', 'succeeded', 'failed'].includes(type) && (
          <RunStatusIcon status={type} className='text-qrinavy' />
        )}
      </div>
      <div className={classNames('text-qrinavy font-semibold flex-grow mt-0.5', {
        'text-qrigreen': type === 'succeeded',
        'text-qrired-700': type === 'failed',
      })}>{message}</div>
      <IconButton icon='close' size='xs' onClick={() => {}} />
    </div>
  )
}

export default Toast
