import React from 'react'
import classNames from 'classnames'
import RunStatusIcon from '../run/RunStatusIcon'
import IconButton from '../../chrome/IconButton'

interface ToastProps {
  message: string
  type: 'running' | 'succeeded' | 'failed'
  id: string
}


const Toast: React.FC<ToastProps> = ({ message, type, id }) => {
  return (
    <div className='flex items-center'>
      <div className='px-3'>
        {['running', 'succeeded', 'failed'].includes(type) && (
          <RunStatusIcon status={type} className='text-black' />
        )}
      </div>
      <div className='flex-grow'>
        <div className={classNames('text-black font-semibold flex-grow mt-0.5', {
          'text-qrigreen': type === 'succeeded',
          'text-dangerred': type === 'failed',
        })}>{message}</div>
        <div className='text-xs'>{id}</div>
      </div>
      <IconButton icon='close' size='xs' onClick={() => {}} />
    </div>
  )
}

export default Toast
