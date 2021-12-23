// DatasetWrapper now does all of the API calls for the active dataset

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { QriRef } from '../../qri/ref'
import { selectDsPreviewError } from '../dsPreview/state/dsPreviewState'
import { loadWorkflowByDatasetRef } from '../workflow/state/workflowActions'
import { loadDatasetLogs } from '../activityFeed/state/activityFeedActions'
import NavBar from '../navbar/NavBar'
import DatasetNavSidebar from '../dataset/DatasetNavSidebar'
import NotFoundPage from '../notFound/NotFoundPage'
import WebAppLayout from '../layouts/WebAppLayout'
import { loadHeader } from "../dataset/state/datasetActions"

interface DatasetWrapperProps {
  qriRef?: QriRef
  fetchData?: boolean
  editor?: boolean
}

const DatasetWrapper: React.FC<DatasetWrapperProps> = ({
  qriRef = { username: '', name: '' },
  fetchData = true,
  editor = false,
  children
}) => {
  const dispatch = useDispatch()

  const error = useSelector(selectDsPreviewError)

  if (fetchData) {
    // fetch workflow and logs here so we know whether to enable their respective nav links
    useEffect(() => {
      dispatch(loadWorkflowByDatasetRef(qriRef))
      dispatch(loadDatasetLogs(qriRef))
    }, [ qriRef.username, qriRef.name])

    useEffect(() => {
      dispatch(loadHeader({ username: qriRef.username, name: qriRef.name, path: qriRef.path }))
    }, [dispatch, qriRef.username, qriRef.name, qriRef.path])
  }

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
