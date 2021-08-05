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
}) => {
  let timeFromNowAbbreviation = formatDistanceToNow(timestamp, { addSuffix: true })

  // manipulate the output of date-fns formatDistanceToNow() for shorter screen renders
  timeFromNowAbbreviation = timeFromNowAbbreviation
    .replace('about ', '')
    .replace(' hours ago', 'h')
    .replace('less than ', '<')
    .replace(/ minutes? ago/, 'm')
    .replace('a', '1')

  return (
    <span
      className={className}
      title={format(timestamp, 'MMM d yyyy, h:mm zz')}
    >
      {timeFromNowAbbreviation}
    </span>
  )
}


export default RelativeTimestamp
