import React, { useState } from "react"
import { useHistory } from 'react-router'
import { useDispatch, useSelector } from "react-redux"
import { useLocation } from 'react-router-dom'

import DatasetEditorLayout from './DatasetEditorLayout'
import { loadDataset } from '../dataset/state/datasetActions'
import { loadDatasetCommits } from '../commits/state/commitActions'
import {
  selectDatasetEditorDataset,
  selectDatasetEditorLoading,
  selectDatasetEditorFile,
  selectDatasetEditorError
} from './state/datasetEditorState'
import { setDatasetEditorTitle, commitDataset } from './state/datasetEditorActions'
import { newQriRef } from '../../qri/ref'
import { NewDataset } from '../../qri/dataset'
import Head from '../app/Head'
import { AppDispatch } from "../../store/api"

const DEFAULT_DATASET_COMMIT_TITLE = ''

const ExistingDatasetEditor: React.FC<{}> = () => {
  const dispatch: AppDispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()

  const dataset = useSelector(selectDatasetEditorDataset)
  const isLoading = useSelector(selectDatasetEditorLoading)
  const file = useSelector(selectDatasetEditorFile)
  const error = useSelector(selectDatasetEditorError)

  const [ commitTitle, setCommitTitle ] = useState(DEFAULT_DATASET_COMMIT_TITLE)

  const handleCommit = () => {
    const qriRef = newQriRef({
      username: dataset.username,
      name: dataset.name
    })

    const theDataset = NewDataset({
      meta: dataset.meta,
      readme: dataset.readme
    })

    dispatch(commitDataset(qriRef, theDataset, commitTitle, file))
      .then(res => {
        if (res.type === 'API_COMMIT_SUCCESS') {
          const ref = newQriRef({ username: qriRef.username, name: qriRef.name, path: qriRef.path })
          dispatch(loadDataset(ref))
          dispatch(loadDatasetCommits(ref))

          handleClose()
        }
      })
  }

  let commitBarContent = (
    <>Edit your dataset here and press Commit</>
  )

  let commitButtonDisabled = false

  if (commitTitle === DEFAULT_DATASET_COMMIT_TITLE) {
    commitBarContent = (
      <>Enter a message to commit your changes</>
    )
    commitButtonDisabled = true
  }

  if (error) {
    commitBarContent = (
      <span className='text-warningyellow'>{error}</span>
    )
  }

  const handleTitleChange = (_: string, value: string) => {
    dispatch(setDatasetEditorTitle(value))
  }

  const handleClose = () => {
    history.push(`/${dataset.username}/${dataset.name}/history${location.hash}`)
  }

  return (
    <>
      <Head data={{
        title: `${dataset.meta?.title || dataset.name} - Edit Dataset`
      }}/>
      <DatasetEditorLayout
        dataset={dataset}
        commitTitle={commitTitle}
        commitBarContent={commitBarContent}
        commitLoading={isLoading}
        showCommitBar={true}
        titleEditable
        onTitleChange={handleTitleChange}
        onCommitTitleChange={(commitTitle: string) => { setCommitTitle(commitTitle) }}
        onCommit={handleCommit}
        onClose={handleClose}
        commitButtonDisabled={commitButtonDisabled}
      />
    </>
  )
}

export default ExistingDatasetEditor
