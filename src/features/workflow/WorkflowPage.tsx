import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'

import Spinner from '../../chrome/Spinner'
import { selectWorkflowDataset } from '../workflow/state/workflowState'
import { setWorkflowRef } from './state/workflowActions'
import { selectLatestDryRun } from './state/workflowState'
import { QriRef } from '../../qri/ref'
import { NewDataset } from '../../qri/dataset'
import Workflow from './Workflow'
import RunBar from './RunBar'
import DatasetScrollLayout from '../dataset/DatasetScrollLayout'

interface WorkflowPageProps {
  qriRef: QriRef
}

const WorkflowPage: React.FC<WorkflowPageProps> = ({ qriRef }) => {
  const dispatch = useDispatch()
  let dataset = useSelector(selectWorkflowDataset)
  const latestRun = useSelector(selectLatestDryRun)
  let { username, name } = useParams()

  // if qriRef is empty, this is a new workflow
  const isNew = qriRef.username === '' && qriRef.name === ''

  // if new, make a mock dataset for rendering the headers
  if (isNew) {
    dataset = NewDataset({
      peername: username,
      name,
      meta: {
        title: 'New Dataset from Workflow'
      }
    })
  }

  // don't fetch the dataset if this is a new workflow
  useEffect(() => {
    // ensures that workflowDataset username and name match the route
    dispatch(setWorkflowRef(qriRef))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const runBar = <RunBar status={latestRun ? latestRun.status : "waiting" } />

  return (
    <>
      {!dataset && !isNew
      ? (<div className='w-full h-full p-4 flex justify-center items-center'>
          <Spinner color='#4FC7F3' />
        </div>)
      : (
            <DatasetScrollLayout headerChildren={runBar} useScroller>
              <Workflow qriRef={qriRef} />
            </DatasetScrollLayout>
        )}
    </>
  )
}

export default WorkflowPage
