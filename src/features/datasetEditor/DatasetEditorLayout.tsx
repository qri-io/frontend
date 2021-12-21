import React, { ReactFragment } from "react"
import { useLocation } from "react-router-dom"
import { useParams } from 'react-router'

import TabbedComponentViewer from "../dsComponents/TabbedComponentViewer"
import { Dataset, qriRefFromDataset, ComponentName } from "../../qri/dataset"
import { newQriRef, refParamsFromLocation } from '../../qri/ref'
import { newVersionInfoFromDataset } from "../../qri/versionInfo"
import IconLink from "../../chrome/IconLink"
import CommitBar from "../../chrome/CommitBar"
import DatasetHeaderLayout from "../dataset/DatasetHeaderLayout"

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
  commitButtonDisabled?: boolean
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
  onClose,
  commitButtonDisabled = false
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
        <div className='flex flex-grow min-h-0'>
          <TabbedComponentViewer
            preview
            showLoadingState={false}
            dataset={dataset}
            selectedComponent={qriRef.component as ComponentName || 'body'}
            editor
          />
        </div>
      </div>
      { showCommitBar && <CommitBar
        commitBarContent={commitBarContent}
        commitLoading={commitLoading}
        commitTitle={commitTitle}
        onCommitTitleChange={onCommitTitleChange}
        onCommit={onCommit}
        disabled={commitButtonDisabled}
      />}
    </div>
  )
}

export default DatasetEditorLayout
