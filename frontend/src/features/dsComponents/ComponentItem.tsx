import React from 'react'
import classNames from 'classnames'
import { Action } from 'redux'

import { ComponentStatus, ComponentName } from '../../qri/dataset'
import Icon from '../../chrome/Icon'
import StatusDot from '../../chrome/StatusDot'

export interface ComponentItemProps {
  displayName: string
  name: ComponentName
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
  name,
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
      className={classNames('flex flex-grow mw-40 mr-2 last:mr-0 py-3 rounded-tr-lg rounded-tl-lg group justify-center', {
        'selected': selected,
        'bg-white': selected,
        'text-qripink': selected,
        'bg-gray-200': !selected,
        'text-gray-400': disabled,
        'text-qrinavy': !disabled,
        'hover:cursor-pointer': !disabled,
        'w-1/4': displayName === 'Data'
      })}
      onClick={() => {
        if (onClick && displayName) {
          onClick(name)
        }
      }}
    >
      {icon && <Icon icon={icon} size='sm' className='mt-1 mr-3' color={disabled ? 'medium' : color} />}
      <div>
        <div className='font-medium'>{displayName}</div>
        <div>{filename}</div>
      </div>
      <StatusDot status={status} />
    </div>
  )
}

export default ComponentItem
