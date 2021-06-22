import React from 'react'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

import Icon from '../../chrome/Icon'
import { Workflow } from '../../qrimatic/workflow'
import { deployStatusInfoMap } from './deployStatus'
import { newDeployStatusSelector } from './state/deployState'

export interface DeployStatusIndicatorProps {
  workflow: Workflow
}

const DeployStatusIndicator: React.FC<DeployStatusIndicatorProps> = ({ workflow }) => {
  const status = useSelector(newDeployStatusSelector(workflow.id))
  const { statusIcon, color, statusText, message } = deployStatusInfoMap[status]

  return (
    <div>
      <div className='mb-2' >
        <Icon icon={statusIcon} className={classNames('mr-2.5', color)} size='md' />
        <span className={classNames('text-sm font-semibold text-gray-600', color)}>{statusText}</span>
      </div>
    </div>
  )
}

export default DeployStatusIndicator
