import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from 'react-router'
import slugify from 'slugify'

import { showModal } from '../app/state/appActions'
import { ModalType } from '../app/state/appState'
import { selectSessionUser } from "../session/state/sessionState"
import { newQriRef } from "../../qri/ref"
import { NewDataset } from "../../qri/dataset"
import DatasetEditorLayout from './DatasetEditorLayout'
import Head from '../app/Head'

import {
  selectDatasetEditorFile,
  selectDatasetEditorDataset,
  selectDatasetEditorLoading
} from "./state/datasetEditorState"

import {
  commitDataset,
  setDatasetEditorTitle
} from "./state/datasetEditorActions"

const DEFAULT_DATASET_NAME = 'untitled-dataset'
const DEFAULT_DATASET_COMMIT_TITLE = 'created dataset from file upload'

const datasetNameFromFilename = (filename: string) => {
  // make lowercase, replace spaces
  let slug = slugify(filename, {
    replacement: '_',
    lower: true
  })
  // remove first character if it is not a letter
  slug = slug.replace(/^[^a-z]+/, '')
  // remove non-alphanumeric characaters
  slug = slug.replace(/[^a-zA-Z0-9-_]/g, '')
  return slug
}

const NewDatasetEditor: React.FC<{}> = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const dataset = useSelector(selectDatasetEditorDataset)

  // dataset name and commit title are stored locally
  // the file and the other components that make up the dataset are stored
  // in the state tree
  const [ datasetName, setDatasetName ] = useState(DEFAULT_DATASET_NAME)
  const [ commitTitle, setCommitTitle ] = useState(DEFAULT_DATASET_COMMIT_TITLE)

  const user = useSelector(selectSessionUser)

  const file = useSelector(selectDatasetEditorFile)
  const isLoading = useSelector(selectDatasetEditorLoading)

  const qriRef = newQriRef({
    username: user.username,
    name: datasetName
  })

  useEffect(() => {
    if (file) {
      if (datasetName === DEFAULT_DATASET_NAME) {
        const filename = file.name.split('.')[0]
        const validatedFilename = datasetNameFromFilename(filename)

        setDatasetName(validatedFilename)
        dispatch(setDatasetEditorTitle(filename))
      }

      setCommitTitle(`created dataset from ${file.name}`)
    }
  }, [file])

  const handleCommit = () => {
    if (file) {
      dispatch(showModal(ModalType.newDatasetSave, {
        username: user.username,
        name: datasetName
      }))
      commitDataset(qriRef, dataset, commitTitle, file)(dispatch)
    }
  }

  const theDataset = NewDataset({
    ...dataset,
    username: qriRef.username,
    name: datasetName,
    body: {},
    readme: {}
  })

  const handleTitleChange = (_: string, value: string) => {
    dispatch(setDatasetEditorTitle(value))
  }

  const commitBarContent = (
    <>Create dataset <strong><span className='font-mono'>{user.username}/{datasetName}</span></strong></>
  )

  const handleClose = () => {
    history.push(`/collection`)
  }

  return (
    <>
      <Head data={{
        title: `${dataset.meta?.title || dataset.name} - New Qri Dataset`
      }}/>
      <DatasetEditorLayout
        dataset={theDataset}
        commitTitle={commitTitle}
        commitBarContent={commitBarContent}
        commitLoading={isLoading}
        showCommitBar
        nameEditable
        onNameChange={(_: string, value: string) => { setDatasetName(value) }}
        titleEditable
        onTitleChange={handleTitleChange}
        onCommitTitleChange={(commitTitle: string) => { setCommitTitle(commitTitle) }}
        onCommit={handleCommit}
        onClose={handleClose}
      />
    </>
  )
}

export default NewDatasetEditor
