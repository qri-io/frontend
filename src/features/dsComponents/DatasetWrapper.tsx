// all dataset routes need the same info to display in the header
// our state tree includes dataset, but it really represents the current version
// of a dataset which can change in the history view
// for all dataset routes, we can reference the dataset in dsPreview to populate the header

import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'

import { newQriRef } from '../../qri/ref'
import { fetchDsPreview } from '../dsPreview/state/dsPreviewActions'
import { selectDsPreviewError } from '../dsPreview/state/dsPreviewState'
import { loadWorkflowByDatasetRef } from '../workflow/state/workflowActions'
import { loadDatasetLogs } from '../activityFeed/state/activityFeedActions'
import NavBar from '../navbar/NavBar'
import DatasetNavSidebar from '../dataset/DatasetNavSidebar'
import NotFoundPage from '../notFound/NotFoundPage'
import WebAppLayout from '../layouts/WebAppLayout'

interface DatasetWrapperProps {
  fetchData?: boolean
  editor?: boolean
}

const DatasetWrapper: React.FC<DatasetWrapperProps> = ({
  fetchData = true,
  editor = false,
  children
}) => {
  const qriRef = newQriRef(useParams())
  const dispatch = useDispatch()

  const error = useSelector(selectDsPreviewError)

  useEffect(() => {
    // dont' fetch data if the user is making a new workflow
    if (fetchData) {
      dispatch(fetchDsPreview(qriRef))
      dispatch(loadWorkflowByDatasetRef(qriRef))
      dispatch(loadDatasetLogs(qriRef))
    }
  }, [ qriRef.username, qriRef.name])

  let content = (
    <div className='flex overflow-hidden w-full flex-grow'>
      <DatasetNavSidebar qriRef={qriRef} editor={editor} />
      {children}
    </div>
  )

  if (error.code === 404) {
    content = (<NotFoundPage/>)
  }

  return (
    <WebAppLayout>
      <div className='flex flex-col h-full w-full'>
        <NavBar />
        {content}
      </div>
    </WebAppLayout>
  )
}

export default DatasetWrapper
