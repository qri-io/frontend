import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { useLocation } from 'react-router-dom'

import { ComponentName } from '../../qri/dataset'
import { newQriRef, refParamsFromLocation } from '../../qri/ref'
import { selectDataset, selectIsDatasetLoading } from '../dataset/state/datasetState'
import DatasetCommitList from '../commits/DatasetCommitList'
import CommitSummaryHeader from '../commits/CommitSummaryHeader'
import TabbedComponentViewer from './TabbedComponentViewer'
import DownloadDatasetButton from '../download/DownloadDatasetButton'
import { loadDataset } from '../dataset/state/datasetActions'
import DatasetFixedLayout from '../dataset/DatasetFixedLayout'

const DatasetComponents: React.FC<{}> = () => {
  const qriRef = newQriRef(refParamsFromLocation(useParams(), useLocation()))
  const dispatch = useDispatch()
  const dataset = useSelector(selectDataset)
  const loading = useSelector(selectIsDatasetLoading)

  useEffect(() => {
    const ref = newQriRef({username: qriRef.username, name: qriRef.name, path: qriRef.path})
    dispatch(loadDataset(ref))
  }, [dispatch, qriRef.username, qriRef.name, qriRef.path])


  return (
    <DatasetFixedLayout headerChildren={<></>}>
      <div className='flex-grow flex overflow-hidden'>
        <DatasetCommitList qriRef={qriRef} />
        <div className='flex flex-col flex-grow overflow-hidden'>
          <CommitSummaryHeader dataset={dataset}>
            <DownloadDatasetButton qriRef={qriRef} />
          </CommitSummaryHeader>
          <TabbedComponentViewer
            dataset={dataset}
            loading={loading}
            selectedComponent={qriRef.component as ComponentName || 'body'}
          />
        </div>
      </div>
    </DatasetFixedLayout>
  )
}

export default DatasetComponents;
