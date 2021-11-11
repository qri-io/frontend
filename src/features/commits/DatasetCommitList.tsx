import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'

import { newQriRef, QriRef } from '../../qri/ref'
import DatasetCommitListItem from './DatasetCommitListItem'
import { loadDatasetCommits } from './state/commitActions'
import { newDatasetCommitsSelector, selectDatasetCommitsLoading } from './state/commitState'
import { NewLogItem } from "../../qri/log"

export interface DatasetCommitsProps {
  qriRef: QriRef
}

const DatasetCommits: React.FC<DatasetCommitsProps> = ({
  qriRef
}) => {
  const dispatch = useDispatch()
  const commits = useSelector(newDatasetCommitsSelector(qriRef))
  const loading = useSelector(selectDatasetCommitsLoading)
  let { fs, hash } = useParams<Record<string, any>>()

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
        <h3 className='text-2xl text-black-500 font-black'>History</h3>
        <div id='dataset_commit_list_versions_text' className='text-xs text-qrigray-400 tracking-wider'>{commits.length} {commits.length === 1 ? 'version' : 'versions'}</div>
      </header>
      <ul className='block flex-grow overflow-y-auto pb-40 pr-8'>
        {/*
          TODO(chriswhong): restore when these features become available
          <HistorySearchBox />
          {editable && <NewVersionButton qriRef={qriRef} />}
        */}
        {loading
          ? Array(3).fill('').map((_, i) => (
            <DatasetCommitListItem
              key={i}
              loading={true}
              logItem={NewLogItem({})}
              active={i === 0}
              // first={i === 0 && !editable} (restore when there is <NewVersionButton> at the top of the list)
              first={i === 0}
              last={i === 2}
            />))
          : commits.map((logItem, i) => (
            <DatasetCommitListItem
              key={i}
              loading={false}
              logItem={logItem}
              active={logItem.path === path}
              // first={i === 0 && !editable} (restore when there is <NewVersionButton> at the top of the list)
              first={i === 0}
              last={i === (commits.length - 1)}
            />
          ))}
      </ul>
    </div>
  )
}

export default DatasetCommits
