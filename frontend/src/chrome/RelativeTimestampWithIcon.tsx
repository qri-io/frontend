import React from 'react'
import classNames from 'classnames'

import Icon from './Icon'
import RelativeTimestamp from './RelativeTimestamp'

interface RelativeTimestampWithIconProps {
  timestamp: Date
  className?: string
}

const RelativeTimestampWithIcon: React.FC<RelativeTimestampWithIconProps> = ({
  timestamp,
  className
 }) => (
   <div className={classNames('flex items-center leading-tight tracking-wider', className)}>
     <Icon icon='clock' size='2xs' className='mr-0.5' /><RelativeTimestamp timestamp={timestamp} />
   </div>
)

export default RelativeTimestampWithIcon
