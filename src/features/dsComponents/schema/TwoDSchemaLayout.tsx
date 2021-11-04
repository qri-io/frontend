// @ts-nocheck
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faToggleOn } from '@fortawesome/free-solid-svg-icons'

import DataType from '../../chrome/DataType'
import KeyValueTable from '../KeyValueTable'
import { ColumnProperties, Schema, schemaToColumns } from '../../../qri/dataset'

interface RowProps {
  column: ColumnProperties
  key: number
}

const buildOtherKeywordsTable = (column: any, index: number) => {
  const filterKeys = ['title', 'type', 'description']
  const hasOtherKeys = Object.keys(column).filter(d => !filterKeys.includes(d)).length > 0
  return hasOtherKeys ? <KeyValueTable index={index} data={column} filterKeys={filterKeys}/> : null
}

const Row: React.FunctionComponent<RowProps> = ({ column, key }) => {
  // let typeContent

  return (
    <div className='row'>
      <div className='cell'>{column.title}</div>
      <div className='cell'>
        <DataType type={column.type}/>
      </div>
      <div className='cell'>{column.description}</div>
      <div className='cell other-keywords'>{buildOtherKeywordsTable(column, key)}</div>
    </div>
  )
}

interface TwoDSchemaLayoutProps {
  schema: Schema
}

const TwoDSchemaLayout: React.FunctionComponent<TwoDSchemaLayoutProps> = ({ schema }) => {
  const columns = schemaToColumns(schema)
  if (columns.length !== 0) {
    return (
      <div className='twod-schema-layout'>
        <div className='flex-table'>
          <div className='row header-row'>
            <div className='cell'>Title</div>
            <div className='cell'>Type</div>
            <div className='cell'>Description</div>
            <div className='cell capitalize other-keywords'>Other</div>
          </div>
          { columns.map((column: ColumnProperties, i: number) => {
            return <Row key={i} column={column} />
          })}
        </div>
      </div>
    )
  }

  return null
}

export default TwoDSchemaLayout
