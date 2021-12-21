import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import classNames from "classnames"

import { newQriRef, QriRef } from '../../qri/ref'
import DatasetCommitListItem from './DatasetCommitListItem'
import { loadDatasetCommits } from './state/commitActions'
import { newDatasetCommitsSelector, selectDatasetCommitsLoading } from './state/commitState'
import { NewLogItem } from "../../qri/log"
import Button from "../../chrome/Button"
import Link from "../../chrome/Link"
import { selectSessionUserCanEditDataset } from '../dataset/state/datasetState'

export interface DatasetCommitsProps {
  qriRef: QriRef
}

const DatasetCommits: React.FC<DatasetCommitsProps> = ({
  qriRef
}) => {
  const dispatch = useDispatch()
  const commits = useSelector(newDatasetCommitsSelector(qriRef))
  const loading = useSelector(selectDatasetCommitsLoading)
  const userCanEditDataset = useSelector(selectSessionUserCanEditDataset)

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
      <ul className='block flex-grow overflow-y-auto hide-scrollbar pr-8'>
        {/*
          TODO(chriswhong): restore when these features become available
          <HistorySearchBox />
          {editable && <NewVersionButton qriRef={qriRef} />}
        */}

        {userCanEditDataset && (
        <li className='flex items-stretch text-black tracking-wider'>
          <div className='relative w-4 mr-5 flex-shrink-0'>
            <div className={classNames('absolute top-2.5 w-4 h-4 rounded-3xl border border-qritile-600')}>&nbsp;</div>
            <div className='relative line-container w-0.5 mx-auto h-full'>
              <div className='absolute -bottom-2 w-full h-11 bg-gray-300 rounded'>&nbsp;</div>
            </div>
          </div>
          <div className='w-full'>
            <Link to={`/${qriRef.username}/${qriRef.name}/edit`}>
              <Button className='mb-6' block disabled={loading || (commits.length ? path !== commits[0].path : false)} type='primary-outline' icon='edit'>Edit</Button>
            </Link>
          </div>
        </li>
        )}

        {loading
          ? Array(3).fill('').map((_, i) => (
            <DatasetCommitListItem
              key={i}
              loading={true}
              logItem={NewLogItem({})}
              active={i === 0}
              first={i === 0}
              last={i === 2}
            />))
          : <>
            {commits.map((logItem, i) => (
              <DatasetCommitListItem
                key={i}
                loading={false}
                logItem={logItem}
                active={logItem.path === path}
                first={i === 0}
                last={i === (commits.length - 1)}
              />
            ))}
          </>}
      </ul>
    </div>
  )
}

export default DatasetCommits
