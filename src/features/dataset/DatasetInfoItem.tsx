import React from 'react'
import ReactTooltip from 'react-tooltip'
import classNames from 'classnames'

import Icon, { IconSize } from '../../chrome/Icon'

export interface DatasetInfoItemProps {
  icon: string | JSX.Element
  label: string | JSX.Element
  tooltip?: string
  iconClassName?: string
  size?: 'sm' | 'md' | 'lg'
}

const DatasetInfoItem: React.FC<DatasetInfoItemProps> = ({
  icon,
  label,
  tooltip,
  iconClassName = '',
  size = 'md'
}) => {
  let iconSize: IconSize = 'xs'
  if (size === 'sm') {
    iconSize = '2xs'
  } else if (size === 'lg') {
    iconSize = 'sm'
  }

  return (
    <div className={classNames('flex items-center inline-block text-xs', {
      'text-black-500 mr-5': size !== 'sm',
      'text-qrigray-400 mr-3': size === 'sm'
    })}>
      {(typeof icon === 'string') ? <Icon icon={icon} size={iconSize} className={classNames('mr-1', iconClassName)} /> : icon }
      {label}
      {tooltip && (
        <ReactTooltip
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
