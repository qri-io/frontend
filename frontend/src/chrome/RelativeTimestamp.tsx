import React from 'react'
import format from 'date-fns/format'
import { formatDistanceToNow } from 'date-fns'

interface RelativeTimestampProps {
  timestamp: Date
}

const RelativeTimestamp: React.FunctionComponent<RelativeTimestampProps> = ({ timestamp }) => (
  <span
    className='relative-timestamp'
    title={format(timestamp, 'MMM d yyyy, h:mm zz')}
  >
    {formatDistanceToNow(timestamp)}
  </span>
)

export default RelativeTimestamp
