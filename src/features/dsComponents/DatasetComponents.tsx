import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { useLocation } from 'react-router-dom'

import { ComponentName, NewDataset } from '../../qri/dataset'
import { newQriRef, refParamsFromLocation } from '../../qri/ref'
import {
  selectDataset, selectDatasetNewCommitTitle,
  selectEditableDataset,
  selectIsDatasetEditable,
  selectIsDatasetLoading
} from '../dataset/state/datasetState'
import DatasetCommitList from '../commits/DatasetCommitList'
import CommitSummaryHeader from '../commits/CommitSummaryHeader'
import TabbedComponentViewer from './TabbedComponentViewer'
import DownloadDatasetButton from '../download/DownloadDatasetButton'
import {
  commitDataset,
  loadDataset,
  setBodyLoading,
  setDatasetEditable
} from '../dataset/state/datasetActions'
import DatasetFixedLayout from '../dataset/DatasetFixedLayout'
import Head from '../app/Head'
import DatasetCommitForm from "../dataset/DatasetCommitForm"
import { loadDatasetCommits } from "../commits/state/commitActions"

const DatasetComponents: React.FC<{}> = () => {
  const qriRef = newQriRef(refParamsFromLocation(useParams(), useLocation()))
  const dispatch = useDispatch()
  const dataset = useSelector(selectDataset)
  const editableDataset = useSelector(selectEditableDataset)
  const title = useSelector(selectDatasetNewCommitTitle)
  const loading = useSelector(selectIsDatasetLoading)
  const isDatasetEditable = useSelector(selectIsDatasetEditable)

  useEffect(() => {
    const ref = newQriRef({ username: qriRef.username, name: qriRef.name, path: qriRef.path })
    dispatch(setBodyLoading())
    if (ref.username && ref.name) {
      dispatch(loadDataset(ref))
    }
  }, [dispatch, qriRef.username, qriRef.name, qriRef.path])

  const onCommit = () => {
    let newDataset = NewDataset({ username: qriRef.username, name: qriRef.name })
    if (dataset.readme?.text !== editableDataset.readme?.text) {
      newDataset.readme = editableDataset.readme
    }
    if (JSON.stringify(dataset.meta) !== JSON.stringify(editableDataset.meta)) {
      newDataset.meta = editableDataset.meta
    }
    commitDataset(qriRef, title, newDataset)(dispatch).then(res => {
      if (res.type === 'API_COMMIT_SUCCESS') {
        const ref = newQriRef({ username: qriRef.username, name: qriRef.name, path: qriRef.path })
        dispatch(setDatasetEditable(false))
        dispatch(loadDataset(ref))
        dispatch(loadDatasetCommits(ref))
      }
    })
  }

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
          {!isDatasetEditable && <CommitSummaryHeader loading={loading} dataset={dataset}>
            <DownloadDatasetButton type='primary' title='Download this Version' qriRef={qriRef} />
          </CommitSummaryHeader>}
          <TabbedComponentViewer
            dataset={dataset}
            selectedComponent={qriRef.component as ComponentName || 'body'}
          />
        </div>
      </div>
      {isDatasetEditable &&
      <DatasetCommitForm
        title={'Make changes in each tab, then click commit to create the next version of this dataset'}
        onCommit={onCommit}
      />}
    </DatasetFixedLayout>
  )
}

export default DatasetComponents
