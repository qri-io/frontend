import React from 'react'

import { qriRefFromString } from '../../qri/ref'
import HistoryList from '../history/HistoryList'
import DatasetHeader from './DatasetHeader'

const DatasetHistory: React.FC<any> = () => {
  const ref = qriRefFromString('rgardaphe/presidents')

  return (
    <div>
      <DatasetHeader qriRef={ref} />
      <HistoryList />
    </div>
  )
}

export default DatasetHistory;