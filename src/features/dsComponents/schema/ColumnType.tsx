import React from 'react'
import classNames from 'classnames'
import { DataTypes } from '../../../chrome/DataType'

import Icon from '../../../chrome/Icon'

export interface ColumnTypeProps {
  type: DataTypes | DataTypes[]
  // to make the ColumnType not editable, do not pass in an onClick
  onClick?: (e) => void
  active?: boolean
  expanded: boolean
}

const ColumnType: React.FunctionComponent<ColumnTypeProps> = ({
  type = 'any',
  onClick,
  active = false,
  expanded
}) => {
  let shownType

  if (typeof type === 'string' || expanded) {
    shownType = type
  } else {
    if (type.length > 1) {
      shownType = 'multi'
    } else if (type.length === 0) {
      shownType = 'any'
    } else {
      shownType = type[0]
    }
  }

  const renderColType = (type: string, key: number) => {
    return (
      <div key={key} className='flex items-center'>
        <span className='flex-grow mr-1'>{type}</span>
        <span className='text-black'>
          <Icon icon={type === 'multi' ? 'unknown' : type} size='xs' />
        </span>
      </div>
    )
  }

  return <div
    className={classNames('column-type', { 'clickable': !!onClick, 'active': active, 'column-type-expanded': expanded })}
    onClick={onClick}
    tabIndex={0}
  >{typeof shownType === 'string' || !expanded
      ? renderColType(shownType, 0)
      : shownType.map((t: string, i) => {
        return renderColType(t, i)
      })}
  </div>
}

export default ColumnType
