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
  // for showing a gray border around the selected tab to contrast with white background
  border?: boolean
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
  color = 'dark',
  border = false
}) => {

  return (
    <div
      id={`${displayName.toLowerCase()}-status`}
      className={classNames('flex flex-grow items-center mw-40 mr-2 last:mr-0 py-1.5 rounded-tr-lg rounded-tl-lg group justify-center relative', {
        'selected': selected,
        'bg-white': selected,
        'text-qripink': selected,
        'bg-qrigray-200': !selected,
        'text-qrigray-400': disabled,
        'text-black': !disabled,
        'hover:cursor-pointer': !disabled,
        'w-1/4': displayName === 'Data',
        'border-grigray-200 border-t-2 border-r-2 border-l-2 -bottom-0.5': border
      })}
      onClick={() => {
        if (onClick && displayName) {
          onClick(name)
        }
      }}
    >
      {icon && <Icon icon={icon} size='2xs' className='mr-2' color={disabled ? 'medium' : color} />}
      <div>
        <div className='font-bold' style={{ fontSize: 12 }}>{displayName}</div>
        <div>{filename}</div>
      </div>
      <StatusDot status={status} />
    </div>
  )
}

export default ComponentItem
