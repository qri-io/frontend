import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useInView } from 'react-intersection-observer'

import { newQriRef } from '../../qri/ref'
import Spinner from '../../chrome/Spinner'
import { loadDataset } from '../dataset/state/datasetActions'
import DatasetHeader from '../dataset/DatasetHeader'
import DatasetMiniHeader from '../dataset/DatasetMiniHeader'
import NavBar from '../navbar/NavBar'
import DatasetNavSidebar from '../dataset/DatasetNavSidebar'
import DeployingScreen from '../deploy/DeployingScreen'
import { selectSessionUserCanEditDataset, selectDataset } from '../dataset/state/datasetState'
import { QriRef } from '../../qri/ref'
import Workflow from './Workflow'
import Scroller from '../scroller/Scroller'


interface DatasetPreviewPageProps {
  qriRef: QriRef
}

const DatasetPreviewPage: React.FC<DatasetPreviewPageProps> = ({
  qriRef
}) => {
  const dispatch = useDispatch()
  const dataset = useSelector(selectDataset)
  const editable = useSelector(selectSessionUserCanEditDataset)
  const isNew = (qriRef.username === 'new')

  const { ref: stickyHeaderTriggerRef, inView } = useInView({
    threshold: 0.7,
    initialInView: true
  });

  // This covers the case where a user created a new workflow before logging in.
  // If they login while working on the workflow, the `user` will change, but the
  // params used to generate the `qriRef` will not (because they are generated
  // from the url, which has not changed). This check ensures that the correct
  // username is propagated after login/signup.
  if (isNew) {
    qriRef.username = user.username
  }

  useEffect(() => {
    if (isNew) { return }
    const ref = newQriRef({username: qriRef.username, name: qriRef.name, path: qriRef.path})
    dispatch(loadDataset(ref))
  }, [dispatch, qriRef.username, qriRef.name, qriRef.path, isNew])

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
              <DatasetMiniHeader dataset={dataset} show={inView} />
              <div className='p-7 w-full'>
                <div ref={stickyHeaderTriggerRef}>
                  <DatasetHeader dataset={dataset} editable={editable} />
                </div>
                <Workflow qriRef={qriRef}/>
              </div>
            </Scroller>
          )}
        <DeployingScreen qriRef={qriRef} />
      </div>
    </div>
  )
}

export default DatasetPreviewPage
