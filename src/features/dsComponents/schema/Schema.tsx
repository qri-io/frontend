import React from 'react'
import cloneDeep from 'clone-deep'

import { Schema as ISchema } from '../../../qri/dataset'
import SchemaItem, { SchemaItemType } from './SchemaItem'

interface SchemaProps {
  data?: ISchema
  onChange?: (schema: ISchema, e: React.ChangeEvent) => void
  editable?: boolean
}

const Schema: React.FC<SchemaProps> = ({
  data,
  onChange,
  editable = false
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

  const thCellClassName = 'px-2 py-2 whitespace-nowrap max-w-xs'

  const thClassName = 'h-6 bg-white font-medium text-left p-0 p-0 border-t border-r border-b border-gray-200 text-black capitalize text-sm'

  return (
    <div className='overflow-x-scroll'>
      <table className='table text-xs border-separate border-l border-gray-200 w-full tracking-wider break-words' style={{ borderSpacing: 0 }}>
        <thead>
          <tr className='border-t border-b uppercase' style={{ fontSize: '.7rem' }}>
            <th className={thClassName}>
              <div className={thCellClassName}>
                title
              </div>
            </th>
            <th className={thClassName}>
              <div className={thCellClassName}>
                type
              </div>
            </th>
            <th className={thClassName}>
              <div className={thCellClassName}>
                description
              </div>
            </th>
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
    </div>
  )
}

export default Schema
