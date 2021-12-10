import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom"

import { selectSessionUser } from "../session/state/sessionState"
import TabbedComponentViewer from "../dsComponents/TabbedComponentViewer"
import { newQriRef } from "../../qri/ref"
import { newVersionInfo } from "../../qri/versionInfo"
import { NewDataset } from "../../qri/dataset"

import TextInput from "../../chrome/forms/TextInput"
import Button from "../../chrome/Button"
import DatasetHeaderRender from "../dataset/DatasetHeaderRender"
import {
  selectManualDatasetFile,
  selectManualDatasetMeta,
  selectManualDatasetFileUploading,
  selectManualDatasetUploadError
} from "./state/manualDatasetCreationState"
import {
  saveManualDataset,
  setManualDatasetCreationTitle
} from "./state/manualDatasetCreationActions"
import Spinner from "../../chrome/Spinner"
import Head from '../app/Head'

const DEFAULT_DATASET_NAME = 'untitled-dataset'
const DEFAULT_DATASET_COMMIT_TITLE = 'created dataset from file upload'

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
  const uploadError = useSelector(selectManualDatasetUploadError)

  const qriRef = newQriRef({
    username: user.username,
    name: datasetName
  })

  useEffect(() => {
    if (file) {
      if (datasetName === DEFAULT_DATASET_NAME) {
        const filename = file.name.split('.')[0]
        setDatasetName(filename)
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

      saveManualDataset(qriRef, file, dataset, commitTitle)(dispatch).then(res => {
        if (res.type === 'API_SAVEUPLOAD_SUCCESS') {
          history.push(`/${res.payload.data.peername}/${res.payload.data.name}/history`)
        }
      })
    }
  }

  // DatasetHeader wants the title as header.metaTitle
  const header = newVersionInfo({
    metaTitle: datasetTitle
  })

  return (
    /* top level div is a clone of DatasetFixedLayout, but we didn't use it because we need a different Header */
    <div className='flex flex-col flex-grow bg-qrigray-100' style={{ borderTopLeftRadius: 20 }}>
      <div className='flex flex-col overflow-hidden p-7 flex-grow border-qritile-600 border-2' style={{ borderTopLeftRadius: 20 }}>
        <Head data={{
          title: `${datasetTitle} - New Qri Dataset`
        }}/>
        <DatasetHeaderRender
          qriRef={qriRef}
          header={header}
          onRename={(_, value: string) => { setDatasetName(value) }}
          onTitleChange={(_, value: string) => { dispatch(setManualDatasetCreationTitle(value)) }}
          editable
          manualCreation
        />
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
        <p className='text-sm text-white'>Press Commit to create the new dataset <strong><span className='font-mono'>{user.username}/{datasetName}</span></strong></p>
        <div className='flex items-center'>
          <TextInput
            error={uploadError}
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
