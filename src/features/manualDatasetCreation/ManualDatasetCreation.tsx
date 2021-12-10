import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import slugify from 'slugify'

import { showModal } from '../app/state/appActions'
import { ModalType } from '../app/state/appState'
import { selectSessionUser } from "../session/state/sessionState"
import TabbedComponentViewer from "../dsComponents/TabbedComponentViewer"
import { newQriRef } from "../../qri/ref"
import { newVersionInfo } from "../../qri/versionInfo"
import { NewDataset } from "../../qri/dataset"

import TextInput from "../../chrome/forms/TextInput"
import Button from "../../chrome/Button"
import IconLink from "../../chrome/IconLink"
import DatasetHeaderLayout from "../dataset/DatasetHeaderLayout"
import {
  selectManualDatasetFile,
  selectManualDatasetMeta,
  selectManualDatasetFileUploading
} from "./state/manualDatasetCreationState"
import {
  saveManualDataset,
  setManualDatasetCreationTitle
} from "./state/manualDatasetCreationActions"
import Spinner from "../../chrome/Spinner"
import Head from '../app/Head'

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

const ManualDatasetCreation: React.FC<{}> = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const meta = useSelector(selectManualDatasetMeta)
  const { title: datasetTitle } = meta

  // dataset name and commit title are stored locally
  // the file and the other components that make up the dataset are stored
  // in the state tree
  const [ datasetName, setDatasetName ] = useState(DEFAULT_DATASET_NAME)
  const [ commitTitle, setCommitTitle ] = useState(DEFAULT_DATASET_COMMIT_TITLE)

  const user = useSelector(selectSessionUser)

  const file = useSelector(selectManualDatasetFile)
  const fileUploading = useSelector(selectManualDatasetFileUploading)

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
        dispatch(setManualDatasetCreationTitle(filename))
      }

      setCommitTitle(`created dataset from ${file.name}`)
    }
  }, [file])

  const handleCommit = () => {
    if (file) {
      // build a dataset from the components
      const dataset = NewDataset({
        meta
      })
      dispatch(showModal(ModalType.manualCreation, {
        username: user.username,
        name: datasetName
      }))
      saveManualDataset(qriRef, file, dataset, commitTitle)(dispatch)
    }
  }

  // DatasetHeader wants the title as header.metaTitle
  const header = newVersionInfo({
    metaTitle: datasetTitle
  })

  const handleCloseClick = () => {
    history.goBack()
  }

  return (
    /* top level div is a clone of DatasetFixedLayout, but we didn't use it because we need a different Header */
    <div className='flex flex-col flex-grow bg-qrigray-100' style={{ borderTopLeftRadius: 20 }}>
      <div className='flex flex-col overflow-hidden p-7 flex-grow border-qritile-600 border-2' style={{ borderTopLeftRadius: 20 }}>
        <Head data={{
          title: `${datasetTitle} - New Qri Dataset`
        }}/>
        <DatasetHeaderLayout
          qriRef={qriRef}
          header={header}
          onRename={(_, value: string) => { setDatasetName(value) }}
          onTitleChange={(_, value: string) => { dispatch(setManualDatasetCreationTitle(value)) }}
          editable
          manualCreation
        >
          <IconLink icon='close' size='lg' className='pb-6' onClick={handleCloseClick} />
        </DatasetHeaderLayout>
        <div className='flex flex-grow'>
          <TabbedComponentViewer
          preview
          manualCreation
          showLoadingState={false}
          dataset={{ username: '', name: '', path: '' }}
          selectedComponent={qriRef.component || 'body'}
        />
        </div>
      </div>
      { file && <div className='relative animate-flyUp flex items-center justify-between w-full bg-qrigray-1000 py-1 px-3'>
        <p className='text-sm text-white'>Create dataset <strong><span className='font-mono'>{user.username}/{datasetName}</span></strong></p>
        <div className='flex items-center'>
          <TextInput
            onChange={(value: string) => setCommitTitle(value)}
            className='mr-3 w-80'
            inputClassName='p-4'
            name='title'
            value={commitTitle}
            size='sm'
            placeholder='commit message'
          />
          <Button onClick={handleCommit} style={{ height: '32px' }} icon='commit' size='sm' type="secondary">
            {fileUploading ? <Spinner color='#fff' size={6} /> : 'Commit'}
          </Button>
        </div>
      </div>}
    </div>
  )
}

export default ManualDatasetCreation
