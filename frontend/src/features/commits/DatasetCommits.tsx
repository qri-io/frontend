import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { SyncLoader } from 'react-spinners';
import Icon from '../../chrome/Icon';
import { QriRef } from '../../qri/ref';
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

  useEffect(() => {
    dispatch(loadDatasetCommits(qriRef))
  }, [dispatch, qriRef])

  return (
    <div className='my-1 mx-2 max-w-xs flex-grow overflow-y-hidden flex flex-col text-xs'>
      <header className='p-2 flex-grow-0'>
        <Icon className='float-left mr-2 mt-1' icon='clock' />
        <h3 className='text-lg font-bold'>History</h3>
      </header>
      <ul className='block flex-grow overflow-y-auto pl-4 pr-2 pb-40'>
        {commits.map((logItem, i) => <DatasetCommitItem key={i} logItem={logItem} />)}
      </ul>
      {loading && <SyncLoader color='#fff' size={6} />}
    </div>
  )
}

export default DatasetCommits
