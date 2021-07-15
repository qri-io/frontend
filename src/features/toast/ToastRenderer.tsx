import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify'

import Toast from './Toast'
import { deployStarted, deployStopped } from '../deploy/state/deployActions'
import { selectAllDeployStatuses } from '../deploy/state/deployState'

import 'react-toastify/dist/ReactToastify.css'
// minified version is also included
// import 'react-toastify/dist/ReactToastify.min.css';

const ToastRenderer: React.FC<{}> = () => {
  const dispatch = useDispatch()
  const deployStatuses = useSelector(selectAllDeployStatuses())

  // useEffect(() => {
  //   setInterval(() => {
  //     dispatch(deployStarted({ id: 'foo' }))
  //     setTimeout(() => {
  //       dispatch(deployStopped({ id: 'foo', status: 'deployed' }))
  //     }, 3000)
  //   }, 10000)
  // }, [])

  const AUTO_CLOSE_DELAY = 5000
  // gets deploystatuses from state, determines whether to show, update, or dismiss
  // a toast associated with a given workflowId
  // Object.keys(deployStatuses).forEach((workflowId) => {
  //   // if deploying, make sure there is not already a toast showing for this workflowId,
  //   // then create a new toast
  //   if (deployStatuses[workflowId] === 'deploying') {
  //     if(!toast.isActive(workflowId)) {
  //       toast(<Toast message='Deploying Workflow' type='running' />, {
  //         toastId: workflowId,
  //         autoClose: false,
  //       })
  //     }
  //   } else if (deployStatuses[workflowId] === 'deployed') {
  //     // if deploy is successful, update the toast, and autoClose
  //     toast.update(workflowId, {
  //       render: (
  //         <Toast message='Workflow Deployed!' type='succeeded' />
  //       ),
  //       autoClose: AUTO_CLOSE_DELAY
  //     })
  //   } else if (deployStatuses[workflowId] === 'failed') {
  //     // if deploy is successful, update the toast, and autoClose
  //     toast.update(workflowId, {
  //       render: <Toast message='Deploy Failed' type='failed' />,
  //       autoClose: AUTO_CLOSE_DELAY
  //     })
  //   } else {
  //     // any other status, set autoclose
  //     toast.update(workflowId, {
  //       autoClose: AUTO_CLOSE_DELAY
  //     })
  //   }
  // })

  return (
    <div>
      <ToastContainer
        position={toast.POSITION.BOTTOM_LEFT}
        closeButton={false}
        hideProgressBar
      />
    </div>
  )
}

export default ToastRenderer
