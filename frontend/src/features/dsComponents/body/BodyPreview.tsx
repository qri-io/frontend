// TODO(chriswhong): BodyPreview and Body should be combined since they share a lot of the same logic

import React from 'react'
import numeral from 'numeral'

import Dataset,  { Structure, schemaToColumns, ColumnProperties } from '../../../qri/dataset'

import BodyTable from './BodyTable'
import BodyJson from './BodyJson'
import Icon from '../../../chrome/Icon'

export interface BodyProps {
  dataset: Dataset
}

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
  dataset,
}) => {
  const {
    body,
    structure,
  } = dataset

  if (!body) {
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

  const headers = extractColumnHeaders(structure, body)

  return (
    <div className='w-full h-full flex flex-col'>
      <div className='flex mb-3'>
        <div className='flex flex-grow text-sm text-qrigray-400'>
          <div className='mr-4 flex items-center'>
            <Icon icon='rows' size='2xs' className='mr-1'/> {numeral(structure.entries).format('0,0')} rows
          </div>
          <div className='mr-4 flex items-center'>
            <Icon icon='columns' size='2xs' className='mr-1'/> {numeral(headers.length).format('0,0')} columns
          </div>
        </div>
        <div>
          <Icon icon='fullScreen' size='sm'/>
        </div>
      </div>
      <div className='overflow-scroll border border-gray-200'>
      {
        (structure.format === 'csv' && Array.isArray(body))
          ? <BodyTable
              headers={headers}
              body={body.slice(0, 100)} //TODO(chriswhong): fetch previews/paginated body properly so we aren't rendering extremely large tables
            />
          : <BodyJson
              data={body}
              previewWarning={false}
            />
      }
      </div>
    </div>
  )
}

export default Body
