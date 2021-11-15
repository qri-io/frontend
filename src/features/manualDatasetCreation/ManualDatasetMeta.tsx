import React from "react"
import { useDispatch, useSelector } from "react-redux"

import Icon from "../../chrome/Icon"
import TextInput from "../../chrome/forms/TextInput"
import KeysInput from "../../chrome/forms/KeysInput"
import Button from "../../chrome/Button"
import ManualCreationBodyWrapper from "./ManualCreationBodyWrapper"
import { selectManualDatasetMeta } from "./state/manualDatasetCreationState"
import { setManualDatasetCreationMeta } from "./state/manualDatasetCreationActions"
import { Meta } from "../../qri/dataset"

const ManualDatasetMeta: React.FC<{}> = () => {
  const meta = useSelector(selectManualDatasetMeta)
  const dispatch = useDispatch()

  const onTitleChange = (title: string) => {
    onMetaChange('title', title)
  }

  const onDescriptionChange = (description: string) => {
    onMetaChange('description', description)
  }

  const onKeysChange = (keywords: string[]) => {
    onMetaChange('keywords', keywords)
  }

  const onMetaChange = (key: keyof Meta, value: string | string[]) => {
    const newMeta = { ...meta }
    newMeta[key] = value
    dispatch(setManualDatasetCreationMeta(newMeta))
  }

  return (
    <ManualCreationBodyWrapper className='flex flex-col'>
      <div className='mb-5'>
        <h2 className='font-bold text-sm mb-6'>Standard Metadata</h2>
        <h5 className='text-xs text-qrigray-400 font-bold mb-2'>Title</h5>
        <TextInput className='mb-3' placeholder='Give your project a title' onChange={onTitleChange} name='title' value={meta.title || ''}/>
        <h5 className='text-xs text-qrigray-400 font-bold mb-2'>Description</h5>
        <TextInput className='mb-3' placeholder='Write a description' name='title' onChange={onDescriptionChange} value={meta.description || ''}/>
        <h5 className='text-xs text-qrigray-400 font-bold mb-2'>Keywords</h5>
        <KeysInput placeholder='Add some keywords' value={meta.keywords || []} onChange={onKeysChange} />
      </div>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='font-bold text-sm'>Custom Metadata</h2>
        <Button type='primary' icon='plus'>Add</Button>
      </div>
      <div className='flex-grow text-qrigray-400 w-full flex flex-col text-center items-center justify-center border rounded'>
        <Icon icon='face' size='lg' />
        <p>Seems that you don’t have any custom metadata,<br/> click add to start.</p>
      </div>
    </ManualCreationBodyWrapper>
  )
}

export default ManualDatasetMeta
