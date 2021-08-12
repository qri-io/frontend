// all dataset routes need the same info to display in the header
// our state tree includes dataset, but it really represents the current version
// of a dataset which can change in the history view
// for all dataset routes, we can reference the dataset in dsPreview to populate the header

import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import { useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { newQriRef } from '../../qri/ref'
import { fetchDsPreview } from '../dsPreview/state/dsPreviewActions'
import { loadWorkflowByDatasetRef } from '../workflow/state/workflowActions'
import { loadDatasetLogs } from '../activityFeed/state/activityFeedActions'
import NavBar from '../navbar/NavBar'
import DatasetNavSidebar from '../dataset/DatasetNavSidebar'

interface DatasetWrapperProps {
  fetchData: boolean
}

const DatasetWrapper: React.FC<DatasetWrapperProps> = ({
  fetchData = true,
  children
}) => {
  const qriRef = newQriRef(useParams())
  const dispatch = useDispatch()

  useEffect(() => {
    // dont' fetch data if the user is making a new workflow
    if (fetchData) {
      dispatch(fetchDsPreview(qriRef))
      dispatch(loadWorkflowByDatasetRef(qriRef))
      dispatch(loadDatasetLogs(qriRef))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ qriRef.username, qriRef.name])

  return (
    <div className='flex flex-col h-full w-full bg-qrigray-100'>
      <NavBar />
      <div className='flex overflow-hidden w-full flex-grow'>
        <DatasetNavSidebar qriRef={qriRef} />
      {children}
      </div>
    </div>
  )
}

export default DatasetWrapper;
