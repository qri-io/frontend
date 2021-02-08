import React from 'react'
import classNames from 'classnames'
import { faExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ComponentStatus } from '../../models/store'
import Icon from './Icon'


export interface StatusDotProps {
  status: ComponentStatus
  showNoChanges?: boolean
}

export const StatusDot: React.FunctionComponent<StatusDotProps> = (props) => {
  const {
    status,
    showNoChanges = false
  } = props
  let statusTooltip
  let statusColor = ''
  switch (status) {
    case 'modified':
      statusTooltip = 'modified'
      statusColor = 'text-yellow-500'
      break
    case 'add':
    case 'added':
      statusTooltip = 'added'
      statusColor = 'text-green-500'
      break
    case 'removed':
      statusTooltip = 'removed'
      statusColor = 'text-red-600'
      break
    case 'parse error':
      return (<FontAwesomeIcon
        icon={faExclamation}
        className='parse-error'
        style={{ color: '#e04f4f' }}
        data-tip='Parsing Error'
        size='sm' />)
    default:
      if (showNoChanges) {
        return <div>No Changes</div>
      }
      statusTooltip = 'unmodified'
  }

  return (
    <div className={statusColor} style={{ fontSize: '0.55rem' }} data-tip={statusTooltip}>
      {statusColor && <Icon icon='circle' />}
    </div>
  )
}

export default StatusDot
