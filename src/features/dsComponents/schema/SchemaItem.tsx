// @ts-nocheck
import React from 'react'

import DynamicEditField from './DynamicEditField'
import { DataTypes } from '../../../chrome/DataType'
import TypePicker from './TypePicker'
import classNames from 'classnames'

interface SchemaItemProps {
  onChange?: (schemaItem: SchemaItemType, e: React.SyntheticEvent) => void
  // editable defaults to true
  editable?: boolean
  data: SchemaItemType
}

// TODO (ramfox): mesh with Schema modal in `qri/dataset`
export interface SchemaItemType {
  row: number
  title: string
  type: DataTypes | DataTypes[]
  description?: string
  validation?: string
}

const SchemaItem: React.FunctionComponent<SchemaItemProps> = ({
  onChange,
  data,
  editable = true
}) => {
  const [expanded ] = React.useState(false)

  const handleDynamicEditChange = (name: string, value: string, e?: React.SyntheticEvent) => {
    const d = { ...data }
    switch (name) {
      case 'title':
        d.title = value
        break
      case 'description':
        if (value === '') {
          delete d.description
        } else {
          d.description = value
        }
        break
      case 'validation':
        if (value === '') {
          delete d.validation
        } else {
          d.validation = value
        }
        break
    }

    if (onChange) onChange(d, e)
  }

  const handleTypePickerChange = (e: React.SyntheticEvent, value?: DataTypes | DataTypes[]) => {
    const d = { ...data }
    d.type = value || 'any'
    if (onChange) onChange(d, e)
  }

  const tdCellClassName = 'border-r border-b border-qrigray-200 break-words'
  const cellClassName = 'px-2 py-2 break-words'

  // TODO (ramfox): do we have max lengths for title, description?
  return (
    <tr className={classNames('schema-item', { 'expanded': expanded, 'top': data.row === 0 })} key={data.row}>
      <td className={classNames('whitespace-nowrap', tdCellClassName)}>
        <div className={cellClassName}>
          <DynamicEditField
            row={data.row}
            name='title'
            placeholder='title'
            value={data.title || ''}
            onChange={handleDynamicEditChange}
            allowEmpty={false}
            large
            minWidth={100}
            expanded={expanded}
            editable={editable}
          />
        </div>
      </td>
      <td className={classNames('whitespace-nowrap', tdCellClassName)}>
        <div className={classNames('text-qrigray-400', cellClassName)}>
          <TypePicker
            name={data.row}
            onPickType={handleTypePickerChange}
            type={data.type}
            expanded={expanded}
            editable={editable}
          />
        </div>
      </td>
      <td className={classNames('w-full', tdCellClassName)}>
        <div className={classNames('text-qrigray-400', cellClassName)}>
          <DynamicEditField
              row={data.row}
              name='description'
              placeholder='description'
              value={data.description || ''}
              onChange={handleDynamicEditChange}
              allowEmpty expanded={expanded}
              minWidth={100}
              editable={editable}
            />
          </div>
        </td>
    </tr>
  )
}

export default SchemaItem
