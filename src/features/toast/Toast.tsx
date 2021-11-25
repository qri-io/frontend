import React from 'react'
import classNames from 'classnames'
import RunStatusIcon from '../run/RunStatusIcon'
import IconButton from '../../chrome/IconButton'
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectVersionInfo } from "../collection/state/collectionState"
import { datasetAliasFromVersionInfo } from "../../qri/versionInfo"

interface ToastProps {
  message: string
  initID: string
  type: 'running' | 'succeeded' | 'failed' | 'waiting'
}

const Toast: React.FC<ToastProps> = ({ message, initID, type }) => {
  const vi = useSelector(selectVersionInfo(initID))
  let ref = datasetAliasFromVersionInfo(vi)
  return (
    <div className='flex items-center'>
      <div className='px-3'>
        {['running', 'succeeded', 'failed', 'waiting'].includes(type) && (
          <RunStatusIcon status={type === 'waiting' ? 'running' : type} className={classNames('text-black', {
            'text-qrigreen': type === 'succeeded',
            'text-qrigray-400': type === 'waiting',
            'text-dangerred': type === 'failed'
          })} />
        )}
      </div>
      <div className='flex-grow'>
        <div className={classNames('text-black font-semibold flex-grow mt-0.5', {
          'text-qrigreen': type === 'succeeded',
          'text-qrigray-400': type === 'waiting',
          'text-dangerred': type === 'failed'
        })}>{message}</div>
        <Link to={`/${ref}/runs`}
              className='text-black w-56 whitespace-nowrap overflow-hidden block text-sm overflow-ellipsis'>
          {ref}
        </Link>
      </div>
      <IconButton icon='close' size='xs' onClick={() => {}} />
    </div>
  )
}

export default Toast
