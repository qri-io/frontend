import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import classNames from 'classnames'

import { LogItem } from '../../qri/log'
import { newQriRef, refParamsFromLocation } from '../../qri/ref'
import { NewDataset } from '../../qri/dataset'
import { pathToDatasetHistory } from '../dataset/state/datasetPaths'
import DatasetCommitInfo from '../../chrome/DatasetCommitInfo'

export interface DatasetCommitProps {
  logItem: LogItem
  active?: boolean
  isLink?: boolean
}

const DatasetCommit: React.FC<DatasetCommitProps> = ({
  logItem,
  active = false,
  isLink = true
}) => {
  const location = useLocation()
  // create a Dataset to pass into DatasetCommitInfo
  const dataset = NewDataset({
    username: logItem.username,
    path: logItem.path,
    commit: {
      title: logItem.title,
      timestamp: logItem.timestamp
    }
  })

  const content = (
    <DatasetCommitInfo dataset={dataset} small />
  )

  const containerClassNames = classNames('block rounded-md px-3 py-3 mb-6 w-full overflow-x-hidden', active && 'bg-white', !active && 'text-qrigray-400 border border-qrigray-300')

  if (isLink) {
    return (
      <Link
        className={containerClassNames}
        to={pathToDatasetHistory(newQriRef(refParamsFromLocation(logItem, location)))}
        style={{ fontSize: 11 }}
      >
        {content}
      </Link>
    )
  }

  return (
    <div
      className={containerClassNames}
      style={{ fontSize: 11 }}
    >
      {content}
    </div>
  )

}

export default DatasetCommit
