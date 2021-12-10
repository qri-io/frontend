import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import DatasetHeaderLayout from './DatasetHeaderLayout'
import {
  renameDataset
} from './state/datasetActions'
import {
  selectDatasetHeader,
  selectIsHeaderLoading
} from "./state/datasetState"
import { qriRefFromVersionInfo } from "../../qri/versionInfo"

export interface DatasetHeaderProps {
  border?: boolean
  editable?: boolean
}

export const newWorkflowTitle: string = 'Untitled Dataset'
// DatasetHeader and DatasetMiniHeader now accept children which will be displayed
// in the right side where the default buttons are located. This is useful for
// overriding the download button with the dry run button in the workflow editor

const DatasetHeader: React.FC<DatasetHeaderProps> = ({
  border = false,
  editable = false,
  children
}) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const header = useSelector(selectDatasetHeader)
  const headerLoading = useSelector(selectIsHeaderLoading)
  const qriRef = qriRefFromVersionInfo(header)

  const handleRename = (_: string, value: string) => {
    renameDataset(qriRef, { username: header.username, name: value })(dispatch)
      .then(({ type }) => {
        if (type === 'API_RENAME_SUCCESS') {
          const newPath = history.location.pathname.replace(header.name, value)
          history.replace(newPath)
        }
      })
  }

  return (
    <DatasetHeaderLayout
      qriRef={qriRef}
      header={header}
      headerLoading={headerLoading}
      border={border}
      onRename={handleRename}
      editable={editable}
    >
      {children}
    </DatasetHeaderLayout>
  )
}

export default DatasetHeader
