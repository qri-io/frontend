import React from 'react'
import cloneDeep from 'clone-deep'

import { Schema as ISchema } from '../../../qri/dataset'
import SchemaItem, { SchemaItemType } from './SchemaItem'

interface SchemaProps {
  data: ISchema | undefined
  onChange?: (schema: ISchema, e: React.ChangeEvent) => void
  // defaults to true
  editable: boolean
}

const Schema: React.FunctionComponent<SchemaProps> = ({
  data,
  onChange,
  editable = true
}) => {
  if (!data) {
    return <div className='margin'>No schema specified</div>
  }
  if (!data.items || !data.items.items) {
    return <div>Invalid schema</div>
  }

  const items = data.items.items

  const onChangeHandler = (schemaItem: SchemaItemType, e: React.ChangeEvent) => {
    const s = cloneDeep(data)
    const row = schemaItem.row
    // don't pass back 'row'
    s.items.items[row] = { ...schemaItem, row: undefined }
    if (onChange) onChange(s, e)
  }

  return (
    <table className='w-full'>
      <thead>
        <tr className='border-t border-b uppercase' style={{ fontSize: '.7rem' }}>
          <th className='py-2 pl-2'></th>
          <th className='py-2 pl-2'>title</th>
          <th className='py-2 pl-2'>type</th>
          <th className='py-2 pl-2'>description</th>
          <th className='py-2 pl-2'>validation</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item: SchemaItemType, i: number) => {
          return (
            <SchemaItem
              onChange={onChange && onChangeHandler}
              data={{ ...item, row: i }}
              editable={editable}
              key={i}
            />
          )
        })}
      </tbody>
    </table>
  )
}

export default Schema
