import React, { useState } from 'react'
import { useDispatch, useSelector } from "react-redux"

import IconButton from "../../../chrome/IconButton"
import { clearModal } from "../../app/state/appActions"
import Button from "../../../chrome/Button"
import TextInput from "../../../chrome/forms/TextInput"
import { selectIsDatasetLoading, selectTitleError } from "../state/datasetState"
import Spinner from "../../../chrome/Spinner"

export interface EditDatasetTitleModalProps {
  title: string
  onCommit: (title: string, commitTitle: string) => void
}

const EditDatasetTitleModal: React.FC<EditDatasetTitleModalProps> = ({ title, onCommit }) => {
  const dispatch = useDispatch()
  const titleEditError = useSelector(selectTitleError)
  const loading = useSelector(selectIsDatasetLoading)

  const [newTitle, setNewTitle] = useState(title)
  const [commitTitle, setCommitTitle] = useState('update meta.title')

  const handleTitleChange = (e: string) => {
    setNewTitle(e)
  }

  const handleCommitTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommitTitle(e.target.value)
  }

  const handleCommit = () => {
    onCommit(newTitle, commitTitle)
  }

  return (
    <div className='p-5'>
      <div className='flex mb-3' style={{ width: 520 }}>
        <TextInput error={titleEditError} className='w-full mr-12' inputClassName='text-2xl font-bold' name={'title'} value={newTitle} onChange={handleTitleChange}/>
        <IconButton icon='close' onClick={() => dispatch(clearModal())} />
      </div>
      <p className='text-qrigray-700 text-sm mb-4'>This title is part of the meta for this dataset editing it will create a new version</p>
      <div className='flex items-center'>
        <input
          type='text'
          style={{ height: 24 }}
          value={commitTitle}
          onChange={handleCommitTitleChange}
          className='border-none flex-shrink-0 flex items-center px-2.5 rounded-lg bg-qrigray-200 text-grigray-400 text-sm mr-6 w-3/4'
        />
        <Button className='' type='secondary' onClick={handleCommit} block>{loading ? <Spinner color='#fff' size={6} /> : 'Commit'}</Button>
      </div>
    </div>
  )
}

export default EditDatasetTitleModal
