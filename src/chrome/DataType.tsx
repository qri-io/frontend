import React from 'react'
import classNames from 'classnames'

import Icon from './Icon'

export type DataTypes = 'string' | 'integer' | 'number' | 'boolean' | 'null' | 'any' | 'array' | 'object'

interface DataTypeProps {
  type: DataTypes
  className?: string
  showLabel?: boolean
}

const DataType: React.FunctionComponent<DataTypeProps> = ({
  type = '',
  className = '',
  showLabel = true
}) => {
  return (
    <div className={classNames('flex items-center', className)}>
      {showLabel && (<div>{type}</div>)}
      <div className='flex items-center'><Icon icon={type} size='xs' /></div>
    </div>
  )
}

export default DataType
