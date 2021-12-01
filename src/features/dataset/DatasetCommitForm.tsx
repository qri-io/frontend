import React from "react"
import { useDispatch, useSelector } from "react-redux"

import TextInput from "../../chrome/forms/TextInput"
import Button from "../../chrome/Button"
import {
  selectCommitError,
  selectCommitLoading,
  selectDatasetNewCommitTitle
} from "./state/datasetState"
import { setDatasetCommitTitle } from "./state/datasetActions"
import Spinner from "../../chrome/Spinner"

interface DatasetCommitFormProps {
  title: string
  onCommit: () => void
}

const DatasetCommitForm: React.FC<DatasetCommitFormProps> = ({ title, onCommit }) => {
  const commitTitle = useSelector(selectDatasetNewCommitTitle)
  const commitLoading = useSelector(selectCommitLoading)
  const commitError = useSelector(selectCommitError)
  const dispatch = useDispatch()

  const setCommitTitle = (title: string) => {
    dispatch(setDatasetCommitTitle(title))
  }

  const handleCommit = () => {
    if (commitTitle.length) {
      onCommit()
    }
  }

  return (
    <div className='relative animate-flyUp flex items-center justify-between w-full bg-qrigray-1000 rounded py-1 px-3 mt-6'>
      <p className='text-sm text-white'>{title}</p>
      <div className='flex items-center'>
        <TextInput
          error={commitError}
          onChange={(value: string) => setCommitTitle(value)}
          className='mr-3 w-80'
          inputClassName='p-4'
          name='title'
          value={commitTitle}
          size='sm'
        />
        <Button disabled={commitLoading} onClick={handleCommit} style={{ height: '32px' }} icon='commit' size='sm' type="secondary">
          {commitLoading ? <Spinner color='#fff' size={6} /> : 'Commit'}
        </Button>
      </div>
    </div>
  )
}

export default DatasetCommitForm
