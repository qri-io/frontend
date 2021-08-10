import React from 'react'
import ReactTooltip from 'react-tooltip'
import classNames from 'classnames'

import Icon from '../../chrome/Icon'

export interface DatasetInfoItemProps {
  icon: string | JSX.Element
  label: string | JSX.Element
  tooltip?: string
  iconClassName?: string
  small?: boolean // uses smaller icons and gray text, used in collection view
}

const DatasetInfoItem: React.FC<DatasetInfoItemProps> = ({
  icon,
  label,
  tooltip,
  iconClassName = '',
  small = false
}) => {


  return (
    <div className={classNames('flex items-center inline-block', {
      'text-qrinavy-500 mr-5': !small,
      'text-qrigray-400 mr-3': small
    })}>
      <div className='mr-1 flex items-center'>
        {(typeof icon === 'string') ? <Icon icon={icon} size={small ? '2xs' : 'sm'} className={iconClassName} /> : icon }
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
