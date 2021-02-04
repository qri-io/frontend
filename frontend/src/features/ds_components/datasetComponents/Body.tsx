import React from 'react'
// import { Action } from 'redux'

// import { ApiActionThunk } from '../../../store/api'
// import { DetailsType, StatsDetails, Details } from '../../../models/details'
import Dataset,  { Structure, schemaToColumns, ColumnProperties } from '../../../qri/dataset'
// import { RouteProps } from '../../../models/store'
// import { fetchBody, fetchCommitBody } from '../../../actions/api'
// import { setDetailsBar } from '../../../actions/ui'
// import { selectDataset, selectWorkingDataset, selectDatasetStats, selectWorkingStats, selectDetails, selectDatasetBodyPageInfo, selectWorkingDatasetBodyPageInfo, selectWorkingStatusInfo } from '../../../selections'
// import { QriRef, qriRefFromRoute } from '../../../models/qriRef'

import BodyTable from './BodyTable'
import BodyJson from './BodyJson'
// import ParseError from '../ParseError'
// import hasParseError from '../../../utils/hasParseError'
// import { connectComponentToProps } from '../../../utils/connectComponentToProps'

export interface BodyProps {
  // qriRef: QriRef
  data: Dataset
  // stats: IStatTypes[]
  // details: Details
  // pageInfo: PageInfo
  // statusInfo: StatusInfo
  // fetchBody: (username: string, name: string, page?: number, pageSize?: number) => ApiActionThunk
  // fetchCommitBody: (username: string, name: string, path: string, page?: number, pageSize?: number) => ApiActionThunk
  // setDetailsBar: (details: Record<string, any>) => Action
}

// function shouldDisplayJsonViewer (format: string) {
//   return !format || (format !== 'csv' && format !== 'xlsx')
// }

const extractColumnHeaders = (structure: Structure, value: any[]): ColumnProperties[] => {
  if (!structure || !value) {
    return []
  }
  const schema = structure.schema

  if (!schema) {
    const firstRow = value && value[0]
    if (!firstRow) return []
    return firstRow.map((d: any, i: number) => `field_${i + 1}`)
  }

  return schemaToColumns(schema)
}

export const Body: React.FunctionComponent<BodyProps> = (props) => {
  const {
    data,
    // pageInfo,
    // stats,
    // details,
    // setDetailsBar,
    // fetchBody,
    // fetchCommitBody,
    // statusInfo,
    // qriRef
  } = props

  // if (hasParseError(statusInfo)) {
  //   return <ParseError component='body' />
  // }

  // const showHistory = !!qriRef.path

  const { body, structure } = data

  if (!structure || !body) {
    return <div>Error cannot show body</div>
  }

  // const makeStatsDetails = (stats: IStatTypes, title: string, index: number): StatsDetails => {
  //   return {
  //     type: DetailsType.StatsDetails,
  //     title: title,
  //     index: index,
  //     stats: stats
  //   }
  // }

  // const handleToggleDetailsBar = (index: number) => {
  //   if (!stats || stats.length === 0 || !headers) return
  //   if (details.type === DetailsType.NoDetails) {
  //     setDetailsBar(makeStatsDetails(stats[index], headers[index].title, index))
  //     return
  //   }
  //   if (details.type === DetailsType.StatsDetails) {
  //     // if the index is the same, then the user has clicked
  //     // on the header twice. The second time, we should
  //     // remove the detailsbar
  //     if (details.index === index) {
  //       setDetailsBar({ type: DetailsType.NoDetails })
  //       return
  //     }
  //     setDetailsBar(makeStatsDetails(stats[index], headers[index].title, index))
  //   }
  // }

  // const handleFetch = (page?: number, pageSize?: number) => {
  //   const { username, name, path = '' } = qriRef
  //   if (showHistory) {
  //     return fetchCommitBody(username, name, path, page, pageSize)
  //   }
  //   return fetchBody(username, name, page, pageSize)
  // }

  // let highlightedColumnIndex
  // if (details.type !== DetailsType.NoDetails) {
  //   highlightedColumnIndex = details.index
  // }

  if (structure.format === 'csv' && Array.isArray(body)) {
    return <BodyTable
    headers={extractColumnHeaders(structure, body)}
    body={body}
    // pageInfo={pageInfo}
    // highlighedColumnIndex={highlightedColumnIndex}
    // onFetch={handleFetch}
    // setDetailsBar={stats && handleToggleDetailsBar}
  />
  }


  return (<BodyJson
          data={body}
          // pageInfo={pageInfo}
          previewWarning={false}
        />
  )
}

export default Body