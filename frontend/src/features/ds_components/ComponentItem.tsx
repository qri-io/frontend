import React from 'react'
import classNames from 'classnames'
import { Action } from 'redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

import { ComponentStatus, ComponentName } from '../../qri/dataset'

import Icon from '../../chrome/Icon'
import StatusDot from '../../chrome/StatusDot'

export interface ComponentItemProps {
  displayName: string

  color?: 'light' | 'dark'
  icon?: string
  filename?: string
  selected?: boolean
  status?: ComponentStatus
  disabled?: boolean
  tooltip?: string
  onClick?: (component: ComponentName) => Action | void
}

export const ComponentItem: React.FunctionComponent<ComponentItemProps> = (
  {
    status = 'unmodified',
    disabled = false,
    displayName,
    selected,
    onClick,
    icon,
    filename,
    color = 'dark'
  }) => {

  let statusIcon = <StatusDot status={status} />

  if (displayName.toLowerCase() === 'commit') {
    statusIcon = <FontAwesomeIcon icon={faArrowRight} style={{ color: '#FFF' }} size='lg' />
  }

  return (
    <div
      id={`${displayName.toLowerCase()}-status`}
      className={classNames('flex text-sm font-light group', {
        'selected': selected,
        'text-gray-400': disabled,
        'hover:cursor-pointer': !disabled
      })}
      onClick={() => {
        if (onClick && displayName) {
          onClick(displayName.toLowerCase() as ComponentName)
        }
      }}
    >
      <div className={`w-1 ${!disabled && 'group-hover:bg-qriblue'} transition-all duration-100 ${selected && 'bg-qriblue'}`}/>
      {icon && (
        <div className='w-8  text-center flex flex-col justify-center'>
          <Icon icon={icon} size='sm' color={disabled ? 'medium' : color} className='mx-auto'/>
        </div>
      )}
      <div className='flex-grow py-3'>
        <div>{displayName}</div>
        <div>{filename}</div>
      </div>
      <div>
        {statusIcon}
      </div>
    </div>
  )
}

export default ComponentItem
