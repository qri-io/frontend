import React from 'react'
import format from 'date-fns/format'
import { formatDistanceToNow } from 'date-fns'

interface RelativeTimestampProps {
  timestamp: Date
  className?: string
}

const RelativeTimestamp: React.FunctionComponent<RelativeTimestampProps> = ({
  timestamp,
  className
 }) => (
  <span
    className={className}
    title={format(timestamp, 'MMM d yyyy, h:mm zz')}
  >
    {formatDistanceToNow(timestamp, { addSuffix: true })}
  </span>
)

export default RelativeTimestamp
