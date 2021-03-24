import React from 'react'
import classNames from 'classnames'
import { Action } from 'redux'

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

export const ComponentItem: React.FC<ComponentItemProps> = ({
  status = 'unmodified',
  disabled = false,
  displayName,
  selected,
  onClick,
  icon,
  filename,
  color = 'dark'
}) => {

  return (
    <div
      id={`${displayName.toLowerCase()}-status`}
      className={classNames('flex mw-40 mr-1 py-3 px-5 rounded-tr-md rounded-tl-md text-sm font-light group', {
        'selected': selected,
        'bg-white': selected,
        'bg-gray-200': !selected,
        'text-gray-400': disabled,
        'hover:cursor-pointer': !disabled
      })}
      onClick={() => {
        if (onClick && displayName) {
          onClick(displayName.toLowerCase() as ComponentName)
        }
      }}
    >
      {icon && <Icon icon={icon} size='sm' className='mt-1 mr-3' color={disabled ? 'medium' : color} />}
      <div>
        <div className='font-bold'>{displayName}</div>
        <div>{filename}</div>
      </div>
      <StatusDot status={status} />
    </div>
  )
}

export default ComponentItem
