import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

import Icon from '../../chrome/Icon';
import Spinner from '../../chrome/Spinner';
import { newQriRef, QriRef } from '../../qri/ref';
import { selectSessionUserCanEditDataset } from '../dataset/state/datasetState';
import NewVersionButton from '../dsComponents/buttons/NewVersionButton';
import DatasetCommitItem from './DatasetCommitItem';
import { loadDatasetCommits } from './state/commitActions';
import { newDatasetCommitsSelector, selectDatasetCommitsLoading } from './state/commitState';

export interface DatasetCommitsProps {
  qriRef: QriRef
}

const DatasetCommits: React.FC<DatasetCommitsProps> = ({
  qriRef
}) => {
  const dispatch = useDispatch()
  const commits = useSelector(newDatasetCommitsSelector(qriRef))
  const loading = useSelector(selectDatasetCommitsLoading)
  const editable = useSelector(selectSessionUserCanEditDataset)
  const { fs, hash } = useParams()
  const path = `/${fs}/${hash}`

  useEffect(() => {
    dispatch(loadDatasetCommits(newQriRef({ username: qriRef.username, name: qriRef.name })))
  }, [dispatch, qriRef.username, qriRef.name])

  return (
    <div className='my-1 mx-2 w-1/5 max-w-xs overflow-y-hidden flex flex-col text-xs'>
      <header className='p-2 flex-grow-0'>
        <Icon className='float-left mr-2 mt-1' icon='clock' />
        <h3 className='text-lg font-bold'>History</h3>
      </header>
      <ul className='block flex-grow overflow-y-auto pl-4 pr-2 pb-40'>
        {editable && <li><NewVersionButton qriRef={qriRef} /></li>}
        {commits.map((logItem, i) => <DatasetCommitItem key={i} logItem={logItem} active={logItem.path === path} />)}
      </ul>
      {loading && <Spinner color='#fff' size={6} />}
    </div>
  )
}

export default DatasetCommits
