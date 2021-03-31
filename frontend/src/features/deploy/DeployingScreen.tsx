import React from 'react'
import { useSelector } from 'react-redux'
import Spinner from '../../chrome/Spinner'

import { QriRef } from '../../qri/ref'
import { selectWorkflow } from '../workflow/state/workflowState'
import { newDeployStatusSelector } from './state/deployState'

export interface DeployingScreenProps {
  qriRef: QriRef
}

const DeployingScreen: React.FC<DeployingScreenProps> = ({ qriRef }) => {
  const workflow = useSelector(selectWorkflow)
  const status = useSelector(newDeployStatusSelector(workflow.id))

  if (status !== 'deploying') {
    return null
  }

  return (
    <div className='absolute h-full flex-grow w-full bg-white z-20 flex flex-col items-center justify-center'>
      <div className='mx-auto mb-8'>
        <Spinner color='#4FC7F3' />
      </div>
      <div className="text-3xl font-bold leading-tighter tracking-tighter mb-4  mx-auto">
        Deploying workflow...
      </div>
    </div>
  )
}

export default DeployingScreen
