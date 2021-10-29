import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
// import { Action } from 'redux'

import Dataset,  { Structure, schemaToColumns, ColumnProperties } from '../../../qri/dataset'
import BodyTable from './BodyTable'
import BodyJson from './BodyJson'
import { loadBody } from '../../dataset/state/datasetActions'
import { newQriRef } from '../../../qri/ref'
// import { ApiActionThunk } from '../../../store/api'
// import { DetailsType, StatsDetails, Details } from '../../../models/details'
// import { RouteProps } from '../../../models/store'
// import { fetchBody, fetchCommitBody } from '../../../actions/api'
// import { setDetailsBar } from '../../../actions/ui'
// import { selectDataset, selectWorkingDataset, selectDatasetStats, selectWorkingStats, selectDetails, selectDatasetBodyPageInfo, selectWorkingDatasetBodyPageInfo, selectWorkingStatusInfo } from '../../../selections'
// import { QriRef, qriRefFromRoute } from '../../../models/qriRef'
// import ParseError from '../ParseError'
// import hasParseError from '../../../utils/hasParseError'
// import { connectComponentToProps } from '../../../utils/connectComponentToProps'

export interface BodyProps {
  data: Dataset
  preview?: boolean
  loading?:boolean
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

const Body: React.FC<BodyProps> = ({
  data,
  preview = false,
  loading = false
}) => {
  const dispatch = useDispatch()
  const { body, structure } = data
  const { path, name, username } = data

  // list out dependencies on dataset body individually for proper memoization
  useEffect(() => {
    if (preview) { return }
    if(name  && username) {
      dispatch(loadBody(newQriRef({ path, name, username }), 1, 100))
    }
  }, [preview, dispatch, path, name, username])

  if (loading) {
    return <BodyTable loading />
  }

  if (!body && !loading) {
    return (
      <div className='h-full w-full flex justify-center items-center'>
        <div>
          There's nothing here yet!
        </div>
      </div>
    )
  }

  if (!structure) {
    return (
      <div className='h-full w-full flex justify-center items-center'>
        <div>
          Error cannot show body without a structure
        </div>
      </div>
    )
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

  return (structure.format === 'csv' && Array.isArray(body))
    ? <BodyTable
        headers={extractColumnHeaders(structure, body)}
        body={body.slice(0, 100)} // TODO(chriswhong): fetch previews/paginated body properly so we aren't rendering extremely large tables
      />
    : <BodyJson
        data={body}
        previewWarning={false}
      />
}

export default Body
