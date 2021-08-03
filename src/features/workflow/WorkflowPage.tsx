import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'

import { newQriRef } from '../../qri/ref'
import Spinner from '../../chrome/Spinner'
import { loadDataset } from '../dataset/state/datasetActions'
import {selectDataset } from '../dataset/state/datasetState'
import { loadWorkflowByDatasetRef, setWorkflowRef } from './state/workflowActions'
import { selectLatestRun } from './state/workflowState'
import { QriRef } from '../../qri/ref'
import { NewDataset } from '../../qri/dataset'
import Workflow from './Workflow'
import RunBar from './RunBar'
import Scroller from '../scroller/Scroller'
import DatasetScrollLayout from '../dataset/DatasetScrollLayout'

interface WorkflowPageProps {
  qriRef: QriRef
}

const WorkflowPage: React.FC<WorkflowPageProps> = ({ qriRef }) => {
  const dispatch = useDispatch()
  let dataset = useSelector(selectDataset)
  const latestRun = useSelector(selectLatestRun)
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
    dispatch(setWorkflowRef(qriRef))
    if (isNew) { return }
    const ref = newQriRef({username: qriRef.username, name: qriRef.name, path: qriRef.path})
    dispatch(loadDataset(ref))
    dispatch(loadWorkflowByDatasetRef(qriRef))

  }, [])

  const runBar = <RunBar status={latestRun ? latestRun.status : "waiting" } />

  return (
    <>
      {!dataset && !isNew
      ? (<div className='w-full h-full p-4 flex justify-center items-center'>
          <Spinner color='#4FC7F3' />
        </div>)
      : (
            <DatasetScrollLayout headerChildren={runBar}>
              <Scroller>
                <Workflow qriRef={qriRef} />
              </Scroller>
            </DatasetScrollLayout>
        )}
    </>
  )
}

export default WorkflowPage
