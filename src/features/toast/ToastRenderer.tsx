import React, { useRef } from 'react'
import { useSelector } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify'

import { Run, RunStatus } from '../../qri/run'
import Toast from './Toast'
import { selectRunsFromEventLog } from '../workflow/state/workflowState'


import 'react-toastify/dist/ReactToastify.css'

const ToastRenderer: React.FC<{}> = () => {

  const runs = useSelector(selectRunsFromEventLog)

  // use a ref to store the workflow status so we can
  // determine when it changes and update an already visible toast
  const runsRef = useRef({} as Record<string, RunStatus>)

  // artifically delay the update to 'success'
  const SUCCESS_START_DELAY = 0

  // after 'success', close the toast 4 seconds later
  const SUCCESS_CLOSE_DELAY = 4000

  // gets all of the known runs from state
  // iterate over each one and show/update/dismiss a toast
  runs.forEach((run: Run) => {
    const { id, status } = run
    // if deploying, make sure there is not already a toast showing for this workflowId,
    // then create a new toast

    switch(status) {
      case 'running':
        // only create a new toast if there's no record for this id in runsRef
        if(!runsRef.current[id]) {
          runsRef.current[id] = status
          toast(<Toast message='Running Workflow...' type='running' id={id} />, {
            toastId: id,
            autoClose: false,
          })
        }
      break
      case 'succeeded':
        // if deploy is successful, update the toast, and autoClose
        // wait SUCCESS_START_DELAY milliseconds so that even "instant" runs still
        // show "running" for a short time
        if (runsRef.current[id] === 'running') {
          runsRef.current[id] = status
          setTimeout(() => {
            toast.update(id, {
              render: (
                <Toast message='Success!' type='succeeded' id={id}  />
              ),
              autoClose: SUCCESS_CLOSE_DELAY,
              onClose: () => { delete runsRef.current[id] }
            })
          }, SUCCESS_START_DELAY)
        }
      break
      default:
        delete runsRef.current[id]
        toast.dismiss(id)
    }
  })

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
