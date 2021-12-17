import React, { useState } from 'react'
import { useDispatch } from "react-redux"

import IconButton from "../../../chrome/IconButton"
import { clearModal } from "../../app/state/appActions"
import Button from "../../../chrome/Button"
import TextInput from "../../../chrome/forms/TextInput"
// import { selectIsDatasetLoading, selectTitleError } from "../state/datasetState"
import Spinner from "../../../chrome/Spinner"

export interface EditDatasetTitleModalProps {
  title: string
  onCommit: (title: string, commitTitle: string) => void
}

const EditDatasetTitleModal: React.FC<EditDatasetTitleModalProps> = ({ title, onCommit }) => {
  const dispatch = useDispatch()
  const titleEditError = ''
  const loading = ''

  const [newTitle, setNewTitle] = useState(title)
  const [commitTitle, setCommitTitle] = useState('update meta.title')

  const handleTitleChange = (e: string) => {
    setNewTitle(e)
  }

  const handleCommitTitleChange = (value: string) => {
    setCommitTitle(value)
  }

  const handleCommit = () => {
    onCommit(newTitle, commitTitle)
  }

  return (
    <div className='p-5 max-w-lg'>
      <div className='flex mb-3'>
        <TextInput className='w-full mr-12' inputClassName='text-2xl font-bold' name={'title'} value={newTitle} onChange={handleTitleChange}/>
        <IconButton icon='close' onClick={() => dispatch(clearModal())} />
      </div>
      <p className='text-qrigray-700 text-sm mb-4'>This title is part of the dataset&apos;s <span className='rounded px-1.5 py-0.5 bg-qrigray-100 text-sm font-mono'>meta</span> component. Editing it will create a new version of the dataset.</p>
      <div className='flex items-center'>
        <div className='flex-grow mr-2'>
          <TextInput
            name='commitTitle'
            type='text'
            value={commitTitle}
            onChange={handleCommitTitleChange}
            size='sm'
          />
        </div>
        <Button className='' type='secondary' onClick={handleCommit} disabled={newTitle === title} style={{
          minWidth: 77
        }}>{loading ? <Spinner color='#fff' size={6} /> : 'Commit'}</Button>
      </div>
      {titleEditError && (<div className='text-xs text-red-500 text-left'>{titleEditError}</div>)}
    </div>
  )
}

export default EditDatasetTitleModal
