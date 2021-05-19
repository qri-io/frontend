import React from 'react'
import classNames from 'classnames'

import Icon from './Icon'

interface DatasetInfoItemProps {
  icon: string
  text: string | Element
  className?: string
}

// TODO(chriswhong): make the prop a user object, or pass in icon URL as a separate prop
const DatasetInfoItem: React.FC<DatasetInfoItemProps> = ({
  icon,
  text,
  className
}) => (
  <div className={classNames('mr-3 text-gray-400 text-sm flex items-center', className)}>
    <Icon icon={icon} size='2xs' className='mr-1' />
    {text}
  </div>
)

export default DatasetInfoItem
