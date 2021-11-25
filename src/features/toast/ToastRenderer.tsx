import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify'

import { Run, RunStatus } from '../../qri/run'
import Toast from './Toast'
import { selectRuns, selectWaitingEventId } from '../events/state/eventsState'
import { loadVersionInfo } from "../collection/state/collectionActions"

import 'react-toastify/dist/ReactToastify.css'
import { removeEvent } from "../events/state/eventsActions"

const ToastRenderer: React.FC<{}> = () => {
  const runs = useSelector(selectRuns)
  const waitingEventId = useSelector(selectWaitingEventId)
  const dispatch = useDispatch()
  // use a ref to store the workflow status so we can
  // determine when it changes and update an already visible toast
  const runsRef = useRef<Record<string, RunStatus>>({})
  const initIDs = runs.map((r: Run) => r.initID)

  // artifically delay the update to 'success'
  const SUCCESS_START_DELAY = 0

  // after 'success', close the toast 4 seconds later
  const SUCCESS_CLOSE_DELAY = 4000

  useEffect(() => {
    initIDs.forEach((initId: string | undefined) => {
      if (initId) { dispatch(loadVersionInfo(initId)) }
    })
  }, [initIDs, dispatch])

  // gets all of the known runs from state
  // iterate over each one and show/update/dismiss a toast
  runs.forEach((run: Run) => {
    const { id, status, initID } = run
    // if deploying, make sure there is not already a toast showing for this workflowId,
    // then create a new toast
    switch (status) {
      case "waiting":
        if (!runsRef.current[id] && run.id === waitingEventId) {
          runsRef.current[id] = status
          toast(<Toast message={'Waiting to run'} initID={initID as string} type='waiting' />, {
            toastId: id,
            autoClose: false,
            onClose: () => dispatch(removeEvent(id))
          })
        }
        break
      case 'running':
        // only create a new toast if there's no record for this id in runsRef
        if (runsRef.current[waitingEventId]) {
          delete runsRef.current[waitingEventId]
          toast.dismiss(waitingEventId)
        }
        if (!runsRef.current[id]) {
          runsRef.current[id] = status
          toast(<Toast message={'Running Workflow...'} initID={initID as string} type='running' />, {
            toastId: id,
            autoClose: false,
            onClose: () => dispatch(removeEvent(id))
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
                <Toast message={'Success!'} initID={initID as string} type='succeeded' />
              ),
              autoClose: SUCCESS_CLOSE_DELAY,
              onClose: () => {
                delete runsRef.current[id]
                dispatch(removeEvent(id))
              }
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
