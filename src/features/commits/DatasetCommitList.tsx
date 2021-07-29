import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

import Spinner from '../../chrome/Spinner';
import HistorySearchBox from '../search/HistorySearchBox'
import { newQriRef, QriRef } from '../../qri/ref';
import { selectSessionUserCanEditDataset } from '../dataset/state/datasetState';
import NewVersionButton from '../dsComponents/buttons/NewVersionButton';
import DatasetCommitListItem from './DatasetCommitListItem';
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
  let { fs, hash } = useParams()

  // if there are no fs/hash in the URL, set it to the fs/hash of the latest commit
  if ((!fs && !hash) && commits.length) {
    if (commits[0].path) {
      [,fs, hash] = commits[0].path.split('/')
    }
  }

  const path = `/${fs}/${hash}`


  useEffect(() => {
    dispatch(loadDatasetCommits(newQriRef({ username: qriRef.username, name: qriRef.name })))
  }, [dispatch, qriRef.username, qriRef.name])

  return (
    <div className='overflow-y-hidden flex flex-col text-xs flex-shrink-0' style={{ width: 300 }}>
      <header className='flex-grow-0 mb-4'>
        <h3 className='text-2xl text-qrinavy-500 font-black'>History</h3>
        <div className='text-xs text-gray-400 tracking-wider'>{commits.length} {commits.length === 1 ? 'version' : 'versions'}</div>
      </header>
      <ul className='block flex-grow overflow-y-auto pb-40 pr-8'>
        <HistorySearchBox />
        {editable && <NewVersionButton qriRef={qriRef} />}
        {commits.map((logItem, i) => (
          <DatasetCommitListItem
            key={i}
            logItem={logItem}
            active={logItem.path === path}
            first={i === 0 && !editable}
            last={i === (commits.length - 1)}
          />
        ))}
      </ul>
      {loading && <Spinner color='#fff' size={6} />}
    </div>
  )
}

export default DatasetCommits
