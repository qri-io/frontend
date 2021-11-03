import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import classNames from 'classnames'
import ContentLoader from "react-content-loader"

import { LogItem } from '../../qri/log'
import { newQriRef, refParamsFromLocation } from '../../qri/ref'
import { pathToDatasetHistory } from '../dataset/state/datasetPaths'
import DatasetCommitInfo from '../../chrome/DatasetCommitInfo'
import { NewDataset, NewCommit } from '../../qri/dataset'

export interface DatasetCommitProps {
  logItem: LogItem
  active?: boolean
  isLink?: boolean
  loading?: boolean
}

const DatasetCommit: React.FC<DatasetCommitProps> = ({
  logItem,
  active = false,
  isLink = true,
  loading = false
}) => {
  const location = useLocation()
  // create a Dataset to pass into DatasetCommitInfo
  const dataset = NewDataset({
    username: logItem.username,
    path: logItem.path,
    commit: NewCommit({
      title: logItem.title,
      timestamp: logItem.timestamp
    })
  })

  const content = loading
    ? (
    <ContentLoader height='38.6' width='177.5'>
      <rect width="145" height="11" y='2' fill="#D5DADD"/>
      <rect width="20" y='24' height="11" rx="1" fill="#D5DADD"/>
      <rect x="26" y='24' width="30" height="11" rx="1" fill="#D5DADD"/>
      <rect x="66" y='24' width="60" height="11" rx="1" fill="#D5DADD"/>
    </ContentLoader>
      )
    : (
        <DatasetCommitInfo dataset={dataset} small automated={!!logItem.runID} />
      )

  const containerClassNames = classNames('block rounded-md px-3 py-3 mb-6 w-full overflow-x-hidden', active && 'bg-white', !active && 'text-qrigray-400 border border-qrigray-300')

  if (isLink && !loading) {
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
