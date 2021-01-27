import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { clearModal } from '../../app/state/appActions'
import { deployWorkflow } from '../state/workflowActions'
import { selectWorkflow } from '../state/workflowState'

const DeployWorkflowModal: React.FC<any> = () => {
  const dispatch = useDispatch()
  const workflow = useSelector(selectWorkflow)

  return (
    <div className="mt-3 sm:mt-0 sm:ml-4 sm:text-left">
     <h3 className="text-2xl leading-6 font-medium text-gray-900">Deploy</h3>
     <p><input type='checkbox' checked disabled /> Run &amp; save before deploying</p>
     <button
       className='py-1 px-4 mx-1 font-semibold shadow-md text-white bg-gray-600 hover:bg-gray-300'
       onClick={() => {
         dispatch(deployWorkflow(workflow))
         dispatch(clearModal())
       }}>Deploy!</button>
    </div>
  )
}

export default DeployWorkflowModal
