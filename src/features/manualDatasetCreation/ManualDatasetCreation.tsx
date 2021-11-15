import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useHistory, useLocation } from "react-router-dom"
import { useParams } from "react-router"

import Link from "../../chrome/Link"
import { selectSessionUser } from "../session/state/sessionState"
import TabbedComponentViewer from "../dsComponents/TabbedComponentViewer"
import { newQriRef, refParamsFromLocation } from "../../qri/ref"
import TextInput from "../../chrome/forms/TextInput"
import Button from "../../chrome/Button"
import {
  selectManualDatasetCommitTitle,
  selectManualDatasetFile,
  selectManualDatasetTitle,
  selectManualDatasetFileUploading,
  selectManualDatasetUploadError
} from "./state/manualDatasetCreationState"
import {
  saveManualDataset,
  setManualDatasetCreationCommitTitle,
  setManualDatasetCreationTitle
} from "./state/manualDatasetCreationActions"
import EditableLabel from "../../chrome/EditableLabel"
import Spinner from "../../chrome/Spinner"

const ManualDatasetCreation: React.FC<{}> = () => {
  const qriRef = newQriRef(refParamsFromLocation(useParams(), useLocation()))
  const user = useSelector(selectSessionUser)
  const currentCommitTitle = useSelector(selectManualDatasetCommitTitle)
  const title = useSelector(selectManualDatasetTitle)
  const file = useSelector(selectManualDatasetFile)
  const fileUploading = useSelector(selectManualDatasetFileUploading)
  const uploadError = useSelector(selectManualDatasetUploadError)
  const [commitTitle, setCommitTitle] = useState(currentCommitTitle)
  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => {
    dispatch(setManualDatasetCreationCommitTitle(commitTitle))
  }, [commitTitle])

  const handleTitleChange = (name: string, value: string) => {
    dispatch(setManualDatasetCreationTitle(value))
  }

  const handleCommit = () => {
    const qriRef = newQriRef({ username: user.username, name: title })
    if (file) {
      saveManualDataset(file, qriRef, commitTitle)(dispatch).then(res => {
        if (res.type === 'API_SAVEUPLOAD_SUCCESS') {
          history.push(`/${user.username}/${title}/history`)
          // commitDatasetTitle(qriRef, title, commitTitle)(dispatch).then(res => {
          //   if (res.type === "API_TITLE_SUCCESS") {
          //
          //   }
          // })
        }
      })
    }
  }

  return (
    <div className='p-7 w-full'>
      <div className='text-md text-qrigray-400 mt-2 mb-5'>
        <div className='text-qrigray-400 flex items-center'>
          <Link to={`/${user.username}`} className='whitespace-nowrap' colorClassName='hover:text-qrigray-800'>{user.username}</Link>/
          <EditableLabel autoEditing placeholder='new-dataset' size='sm' name={'dataset-title'} value={title} onChange={handleTitleChange} />
        </div>
        <h3 className='text-2xl font-bold text-black'>{title}</h3>
      </div>
      <div className='flex'>
        <TabbedComponentViewer
          preview
          manualCreation
          showLoadingState={false}
          dataset={{ username: '', name: '', path: '' }}
          selectedComponent={qriRef.component || 'body'}
        />
      </div>
      { title && file && <div className='relative animate-flyUp flex items-center justify-between w-full bg-qrigray-1000 rounded py-1 px-3 mt-6'>
        <p className='text-sm text-white'>Great!- You are meking a new dataset, remember to make a new commit</p>
        <div className='flex items-center'>
          <TextInput error={uploadError} onChange={(value: string) => setCommitTitle(value)} className='mr-3 w-80' inputClassName='p-4' name='title' value={commitTitle} size='sm' />
          <Button onClick={handleCommit} style={{ height: '32px' }} icon='commit' size='sm' type="secondary">
            {fileUploading ? <Spinner color='#fff' size={6} /> : 'Commit'}
          </Button>
        </div>
      </div>}
    </div>
  )
}

export default ManualDatasetCreation
