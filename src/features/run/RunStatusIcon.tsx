import React from 'react'
import classNames from 'classnames'

import Icon, { IconSize } from '../../chrome/Icon'
import { RunStatus } from '../../qri/run'

export interface RunStatusIconProps {
  status: RunStatus
  className?: string
  size?: IconSize
}

interface StatusMapping {
  icon: string
  color: string
}

type StatusMappings = {
  [key in RunStatus]: StatusMapping
}

// map RunStatus to icon, color
const statusMappings: StatusMappings = {
  waiting: {
    icon: 'circleDash',
    color: 'qrigray-400'
  },
  running: {
    icon: 'loader',
    color: 'qrigray-400'
  },
  succeeded: {
    icon: 'circleCheck',
    color: 'qrigreen'
  },
  failed: {
    icon: 'circleX',
    color: 'qrired-700'
  },
  unchanged: {
    icon: 'circleDash',
    color: 'blue'
  },
  skipped: {
    icon: 'circleDash',
    color: 'blue'
  },
  '': {
    icon: 'circleDash',
    color: 'blue'
  }
}

export const colorFromRunStatus = (status: RunStatus) => {
  return statusMappings[status].color
}

const RunStatusIcon: React.FC<RunStatusIconProps> = ({ status, className, size='sm' }) => {
  const { icon, color } = statusMappings[status]

  return <Icon icon={icon} size={size} className={classNames(`text-${color}`, className)}/>
}

export default RunStatusIcon
