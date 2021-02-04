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
      className={classNames('sidebar-list-item', 'sidebar-list-item-text', {
        'selected': selected,
        'disabled': disabled,
        'hover:cursor-pointer': !disabled
      })}
      onClick={() => {
        if (onClick && displayName) {
          onClick(displayName.toLowerCase() as ComponentName)
        }
      }}
    >
      {icon && (<div className='icon-column'>
        <Icon icon={icon} size='sm' color={disabled ? 'medium' : color}/>
      </div>)}
      <div className='text-column'>
        <div className='text'>{displayName}</div>
        <div className='subtext'>{filename}</div>
      </div>
      <div className={classNames('status-column', { 'disabled': disabled })}>
        {statusIcon}
      </div>
    </div>
  )
}

export default ComponentItem
