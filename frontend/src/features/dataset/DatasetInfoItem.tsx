import React from 'react'
import ReactTooltip from 'react-tooltip'

import Icon from '../../chrome/Icon'

export interface DatasetInfoItemProps {
  icon: string
  label: string
  tooltip?: string
  iconClassName?: string
}

const DatasetInfoItem: React.FC<DatasetInfoItemProps> = ({
  icon,
  label,
  tooltip,
  iconClassName = ''
}) => {


  return (
    <div className='text-qrinavy-500 text-sm flex items-center inline-block mr-5'>
      <div className='mr-1'>
        <Icon icon={icon} size='sm' className={iconClassName} />
      </div>
      {label}
      {tooltip && (
        <ReactTooltip
          id={id}
          place='right'
          effect='solid'
          offset={{
            right: 10
          }}
        >
          {tooltip}
        </ReactTooltip>
      )}
    </div>
  )
}

export default DatasetInfoItem
