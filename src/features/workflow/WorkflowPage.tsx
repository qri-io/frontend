import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import { useInView } from 'react-intersection-observer'

import { newQriRef } from '../../qri/ref'
import Spinner from '../../chrome/Spinner'
import { loadDataset } from '../dataset/state/datasetActions'
import DatasetHeader from '../dataset/DatasetHeader'
import DatasetMiniHeader from '../dataset/DatasetMiniHeader'
import NavBar from '../navbar/NavBar'
import DatasetNavSidebar from '../dataset/DatasetNavSidebar'
import { selectSessionUserCanEditDataset, selectDataset } from '../dataset/state/datasetState'
import { loadWorkflowByDatasetRef, setWorkflowRef } from './state/workflowActions'
import { selectLatestRun } from './state/workflowState'
import { QriRef } from '../../qri/ref'
import { NewDataset } from '../../qri/dataset'
import Workflow from './Workflow'
import RunBar from './RunBar'
import Scroller from '../scroller/Scroller'


interface WorkflowPageProps {
  qriRef: QriRef
}

const WorkflowPage: React.FC<WorkflowPageProps> = ({ qriRef }) => {
  const dispatch = useDispatch()
  let dataset = useSelector(selectDataset)
  const editable = useSelector(selectSessionUserCanEditDataset)
  const latestRun = useSelector(selectLatestRun)
  let { username, name } = useParams()

  const { ref: stickyHeaderTriggerRef, inView } = useInView({
    threshold: 0.7,
    initialInView: true
  });

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

  }, [ qriRef ])

  const runBar = <RunBar status={latestRun ? latestRun.status : "waiting" } />

  return (
    <div className='flex flex-col h-full w-full bg-qrigray-100'>
      <NavBar />
      <div className='flex overflow-hidden w-full flex-grow'>
        <DatasetNavSidebar qriRef={qriRef} />
        {!dataset
        ? (<div className='w-full h-full p-4 flex justify-center items-center'>
            <Spinner color='#4FC7F3' />
          </div>)
        : (
            <Scroller className='overflow-y-scroll overflow-x-hidden flex-grow relative'>
              <DatasetMiniHeader dataset={dataset} show={!inView}>
                {runBar}
              </DatasetMiniHeader>
              <div className='p-7 w-full'>
                <div ref={stickyHeaderTriggerRef}>
                  <DatasetHeader dataset={dataset} editable={editable} showInfo={!isNew}>
                    {runBar}
                  </DatasetHeader>
                </div>
                <Workflow qriRef={qriRef} />
              </div>
            </Scroller>
          )}
      </div>
    </div>
  )
}

export default WorkflowPage
