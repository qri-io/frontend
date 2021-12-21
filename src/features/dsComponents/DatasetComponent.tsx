import React, { useState } from 'react'
import classNames from 'classnames'
import { useDispatch, useSelector } from "react-redux"

import ComponentHeader from './ComponentHeader'
import Dataset, { ComponentName } from '../../qri/dataset'
import Transform from './transform/Transform'
import Body from './body/Body'
import BodyHeader from './body/BodyHeader'
import Commit from './commit/Commit'
import Meta from './meta/Meta'
import Structure from './structure/Structure'
import Readme from './readme/Readme'
import ContentBox from '../../chrome/ContentBox'
import IconLink from '../../chrome/IconLink'
import { selectIsBodyLoading, selectIsDatasetLoading } from "../dataset/state/datasetState"
import {
  setDatasetEditorFile
} from "../datasetEditor/state/datasetEditorActions"
import { selectDatasetEditorFile } from "../datasetEditor/state/datasetEditorState"
import DatasetEditorBodyWrapper from '../datasetEditor/DatasetEditorBodyWrapper'
import DropZone from '../../chrome/DropZone'

export interface DatasetComponentProps {
  dataset: Dataset
  componentName: ComponentName
  // preview is used to change the display of the body table for previews vs history
  preview?: boolean
  showLoadingState?: boolean
  editor: boolean
}

const DatasetComponent: React.FC<DatasetComponentProps> = ({
  dataset,
  componentName,
  preview = false,
  showLoadingState = true,
  editor = false
}) => {
  const [ expanded, setExpanded ] = useState(false)
  const [ dragging, setDragging ] = useState(false)
  const dispatch = useDispatch()
  const loading = useSelector(selectIsDatasetLoading)
  const bodyLoading = useSelector(selectIsBodyLoading)
  const file = useSelector(selectDatasetEditorFile)

  const setDragStateHandler = (dragState: boolean) => {
    return (e: React.SyntheticEvent) => {
      e.preventDefault()
      setDragging(dragState)
    }
  }

  const handleToggleExpanded = () => {
    setExpanded(!expanded)
  }

  const fileUploadHandler = (files: File[]) => {
    dispatch(setDatasetEditorFile(files[0] || null))
  }

  let component: JSX.Element
  let componentHeader: JSX.Element | null = null

  switch (componentName) {
    case 'body':
      component = (
        <Body loading={showLoadingState ? (loading || bodyLoading) : false} data={dataset} />
      )

      componentHeader = (
        <BodyHeader
            loading={ showLoadingState ? (loading || bodyLoading) : false }
            dataset={dataset}
            onToggleExpanded={handleToggleExpanded}
            showDownload={!preview}
            showExpand={!expanded}
          />
      )

      if (editor) {
        component = (
          <DatasetEditorBodyWrapper>
            <div
              onDragExit={setDragStateHandler(false)}
              onDragEnter={setDragStateHandler(true)}
              className={`w-full flex h-full items-center justify-center border rounded ${dragging ? 'bg-qrigray-100' : ''}`}>
              <DropZone file={file} onFileUpload={fileUploadHandler}/>
            </div>
          </DatasetEditorBodyWrapper>
        )

        componentHeader = null
      }

      break
    case 'meta':
      component = <Meta data={dataset.meta} editor={editor} />
      break
    case 'commit':
      component = <Commit data={dataset.commit}/>
      break
    case 'structure':
      component = <Structure data={dataset.structure}/>
      break
    case 'transform':
      component = <>{ dataset.transform && <Transform data={dataset.transform}/> }</>
      break
    case 'readme':
      component = <Readme data={dataset.readme} editor={editor}/>
      break
    default:
      component = <div>Unknown component</div>
  }

  let componentContent = (
    <div className='p-4 h-full'>
      {component}
    </div>
  )
  let componentHeaderBorder = true
  let overflowScroll = true

  // exclude the default padding for some components
  if (['body', 'structure', 'transform'].includes(componentName)) {
    componentContent = component
    componentHeaderBorder = false
  }

  // no padding on readme editor
  if (editor && (componentName === 'readme')) {
    componentContent = component
    componentHeaderBorder = false
    overflowScroll = false
  }

  return (
    <div
      className={classNames('rounded-md bg-white h-full w-full overflow-auto rounded-tl-none rounded-tr-none flex flex-col pb-4', {})}
    >
      <ComponentHeader border={componentHeaderBorder}>
        {componentHeader}
      </ComponentHeader>
      <div className={classNames({
        'flex-grow overflow-auto': overflowScroll,
        'h-full overflow-hidden': !overflowScroll
      })}>
        {componentContent}
      </div>

      {/* full screen component view functions as a modal */}
      { expanded && (
        <div className="fixed top-0 right-0 bottom-0 left-0 inset-0 transition-opacity z-40" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-200 p-4 flex">
            <ContentBox className='flex-grow flex flex-col'>
              <div className='flex'>
                <div className='flex-grow'>
                  <div className='text-sm text-qrigray-400 font-mono'>
                    {dataset.username}/{dataset.name}
                  </div>
                  <div className='text-xl text-black font-semibold'>
                    {dataset.meta?.title || dataset.name}
                  </div>
                </div>
                <div>
                  <IconLink icon='close' onClick={handleToggleExpanded} />
                </div>
              </div>
              <ComponentHeader>
                {componentHeader}
              </ComponentHeader>
              <div style={{ maxHeight: 'calc(100% - 92px)' }} className='overflow-auto flex-grow'>
                {component}
              </div>
            </ContentBox>
          </div>
        </div>
      )}
    </div>
  )
}

export default DatasetComponent
