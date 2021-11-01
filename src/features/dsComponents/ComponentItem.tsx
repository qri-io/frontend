import React from 'react'
import classNames from 'classnames'

import { ComponentStatus, ComponentName } from '../../qri/dataset'
import Icon from '../../chrome/Icon'
import StatusDot from '../../chrome/StatusDot'
import Link from '../../chrome/Link'
import { trackGoal } from '../../features/analytics/analytics'

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
}

export const ComponentItem: React.FC<ComponentItemProps> = ({
  status = 'unmodified',
  disabled = false,
  name,
  displayName,
  selected,
  icon,
  filename,
  color = 'dark',
  border = false
}) => {
  const tabContent = (
    <>
      {icon && <Icon icon={icon} size='2xs' className='mr-2' color={disabled ? 'medium' : color} />}
      <div>
        <div className='font-bold' style={{ fontSize: 12 }}>{displayName}</div>
        <div>{filename}</div>
      </div>
      <StatusDot status={status} />
    </>
  )

  const tabClasses = `flex flex-grow items-center mw-40 mr-2 last:mr-0 py-1.5 rounded-tr-lg rounded-tl-lg group justify-center relative
  ${displayName === 'Data' && 'w-1/4'}`

  const enabledClasses = {
    'selected': selected,
    'bg-white': selected,
    'bg-qrigray-200': !selected,
    'border-grigray-200 border-t-2 border-r-2 border-l-2 -bottom-0.5': border
  }

  const enabledColorClasses = {
    'text-qripink-600': selected,
    'text-black': !selected,
  }

  const disabledClasses = 'text-qrigray-400 bg-qrigray-200'

  if (disabled && !selected) {
    return (
      <div className={classNames(tabClasses, disabledClasses)}>
        {tabContent}
      </div>
    )
  }

  return (
    <Link
      id={`${displayName.toLowerCase()}-status`}
      className={classNames(tabClasses, enabledClasses)}
      colorClassName={classNames('flex items-center', enabledColorClasses)}
      to={`#${name}`}
      onClick={() => {
        // dataset-click-dataset-tab event
        trackGoal('TGPXLRVF', 0)
      }}
    >
      {tabContent}
    </Link>
  )
}

export default ComponentItem
