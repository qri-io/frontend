import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Spinner from '../../chrome/Spinner'
import { selectLatestDeployOrDryRunId, selectWorkflowDataset } from '../workflow/state/workflowState'
import { setWorkflowRef } from './state/workflowActions'
import { QriRef } from '../../qri/ref'
import Workflow from './Workflow'
import RunBar from './RunBar'
import DatasetScrollLayout from '../dataset/DatasetScrollLayout'
import { selectRun } from "../events/state/eventsState"
import Head from '../app/Head'

interface WorkflowPageProps {
  qriRef: QriRef
}

const WorkflowPage: React.FC<WorkflowPageProps> = ({ qriRef }) => {
  const dispatch = useDispatch()
  let dataset = useSelector(selectWorkflowDataset)
  const latestDryRunDeployId = useSelector(selectLatestDeployOrDryRunId)
  const latestRun = useSelector(selectRun(latestDryRunDeployId))

  // if qriRef is empty, this is a new workflow
  const isNew = qriRef.username === '' && qriRef.name === ''

  // don't fetch the dataset if this is a new workflow
  useEffect(() => {
    // ensures that workflowDataset username and name match the route
    dispatch(setWorkflowRef(qriRef))
  }, [])

  const runBar = <RunBar status={latestRun ? latestRun.status : "waiting" } />

  return (
    <>
      <Head data={{
        title: isNew ? ' New Automated Dataset ' : `${qriRef.username}/${qriRef.name} workflow editor | Qri`,
        appView: true
      }}/>
      {dataset || isNew
        ? (<DatasetScrollLayout isNew={isNew} headerChildren={runBar} useScroller>
          <Workflow qriRef={qriRef} />
        </DatasetScrollLayout>)
        : (<div className='w-full h-full p-4 flex justify-center items-center'>
          <Spinner color='#43B3B2' />
        </div>)}
    </>
  )
}

export default WorkflowPage
