import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faToggleOn } from '@fortawesome/free-solid-svg-icons'

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

export interface TypeLabelProps {
  type: string | string[] | undefined
  showLabel?: boolean
}

export const TypeLabel: React.FunctionComponent<TypeLabelProps> = ({ type, showLabel = true }) => {
  let icon

  if (Array.isArray(type)) {
    icon = ''
  } else {
    switch (type) {
      case 'string':
        icon = <span className='font-serif font-bold text-gray-500'>T</span>
        break
      case 'number':
        icon = <span className='font-serif font-bold text-gray-500'>1.0</span>
        break
      case 'integer':
        icon = <span className='font-serif font-bold text-gray-500'>1</span>
        break
      case 'boolean':
        icon = <FontAwesomeIcon icon={faToggleOn} size='xs'/>
        break
      default:
        icon = ''
    }
  }

  return (
    <span className='type-label'>
      <span className='type-icon'>{icon}</span>
      {
        showLabel && (
          <>
            &nbsp;&nbsp;{type}
          </>
        )
      }
    </span>
  )
}

const Row: React.FunctionComponent<RowProps> = ({ column, key }) => {
  // let typeContent

  return (
    <div className='row'>
      <div className='cell'>{column.title}</div>
      <div className='cell'>
        <TypeLabel type={column.type}/>
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
