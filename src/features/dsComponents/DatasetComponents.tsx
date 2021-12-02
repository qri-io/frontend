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
import { loadDataset, setBodyLoading } from '../dataset/state/datasetActions'
import DatasetFixedLayout from '../dataset/DatasetFixedLayout'
import Head from '../app/Head'

const DatasetComponents: React.FC<{}> = () => {
  const qriRef = newQriRef(refParamsFromLocation(useParams(), useLocation()))
  const dispatch = useDispatch()
  const dataset = useSelector(selectDataset)
  const loading = useSelector(selectIsDatasetLoading)

  useEffect(() => {
    const ref = newQriRef({ username: qriRef.username, name: qriRef.name, path: qriRef.path })
    dispatch(setBodyLoading())
    if (ref.username && ref.name) {
      dispatch(loadDataset(ref))
    }
  }, [dispatch, qriRef.username, qriRef.name, qriRef.path])

  return (
    <DatasetFixedLayout headerChildren={<></>}>
      <Head data={{
        title: `${qriRef.username}/${qriRef.name} history | Qri`,
        pathname: location.pathname,
        description: dataset?.meta?.description || `Explore the history of commits for the Qri Dataset ${qriRef.username}/${qriRef.name}`,
        appView: true
      }}/>
      <div className='flex-grow flex overflow-hidden'>
        <DatasetCommitList qriRef={qriRef} />
        <div className='flex flex-col flex-grow overflow-hidden'>
          <CommitSummaryHeader loading={loading} dataset={dataset}>
            <DownloadDatasetButton type='primary' title='Download the full dataset version as a zip file' qriRef={qriRef} />
          </CommitSummaryHeader>
          <TabbedComponentViewer
            dataset={dataset}
            selectedComponent={qriRef.component as ComponentName || 'body'}
          />
        </div>
      </div>
    </DatasetFixedLayout>
  )
}

export default DatasetComponents
