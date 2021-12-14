import React, { ReactFragment } from "react"
import { useLocation } from "react-router-dom"
import { useParams } from 'react-router'

import TabbedComponentViewer from "../dsComponents/TabbedComponentViewer"
import { Dataset, qriRefFromDataset, ComponentName } from "../../qri/dataset"
import { newQriRef, refParamsFromLocation } from '../../qri/ref'

import { newVersionInfoFromDataset } from "../../qri/versionInfo"

import TextInput from "../../chrome/forms/TextInput"
import Button from "../../chrome/Button"
import IconLink from "../../chrome/IconLink"
import DatasetHeaderLayout from "../dataset/DatasetHeaderLayout"

import Spinner from "../../chrome/Spinner"

interface DatasetEditorLayoutProps {
  dataset: Dataset
  commitTitle: string
  commitBarContent: ReactFragment
  commitLoading: boolean
  showCommitBar: boolean
  nameEditable?: boolean
  onNameChange?: (_: string, value: string) => void
  titleEditable?: boolean
  onTitleChange?: (_: string, value: string) => void
  onCommitTitleChange: (commitTitle: string) => void
  onCommit: () => void
  onClose?: () => void
}

const DatasetEditorLayout: React.FC<DatasetEditorLayoutProps> = ({
  dataset,
  commitTitle,
  commitBarContent,
  commitLoading,
  showCommitBar = false,
  nameEditable = false,
  onNameChange,
  titleEditable = false,
  onTitleChange,
  onCommitTitleChange,
  onCommit,
  onClose
}) => {
  // used to parse the selected tab
  const qriRef = newQriRef(refParamsFromLocation(useParams(), useLocation()))

  const handleCloseClick = () => {
    if (onClose) { onClose() }
  }

  return (
    /* top level div is a clone of DatasetFixedLayout, but we didn't use it because we need a different Header */
    <div className='flex flex-col flex-grow bg-qrigray-100' style={{ borderTopLeftRadius: 20 }}>
      <div className='flex flex-col overflow-hidden p-7 flex-grow border-qritile-600 border-2' style={{ borderTopLeftRadius: 20 }}>
        <DatasetHeaderLayout
          qriRef={qriRefFromDataset(dataset)}
          header={newVersionInfoFromDataset(dataset)}
          nameEditable={nameEditable}
          onNameChange={onNameChange}
          titleEditable={titleEditable}
          onTitleChange={onTitleChange}
        >
          <IconLink icon='close' size='lg' className='pb-6' onClick={handleCloseClick} />
        </DatasetHeaderLayout>
        <div className='flex flex-grow'>
          <TabbedComponentViewer
            preview
            showLoadingState={false}
            dataset={dataset}
            selectedComponent={qriRef.component as ComponentName || 'body'}
            editor
          />
        </div>
      </div>
      { showCommitBar && <div className='relative animate-flyUp flex items-center justify-between w-full bg-qrigray-1000 py-1 px-3'>
        <p className='text-sm text-white'>{commitBarContent}</p>
        <div className='flex items-center'>
          <TextInput
            onChange={(value: string) => onCommitTitleChange(value)}
            className='mr-3 w-80'
            inputClassName='p-4'
            name='title'
            value={commitTitle}
            size='sm'
            placeholder='commit message'
          />
          <Button onClick={onCommit} style={{ height: '32px' }} icon='commit' size='sm' type="secondary">
            {commitLoading ? <Spinner color='#fff' size={6} /> : 'Commit'}
          </Button>
        </div>
      </div>}
    </div>
  )
}

export default DatasetEditorLayout
