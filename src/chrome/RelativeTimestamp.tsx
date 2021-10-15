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
    .replace('less than ', '<')
    .replace(/ hours? ago/, 'h')
    .replace(/ minutes? ago/, 'm')
    .replace(/ days? ago/, 'd')
    .replace(/ weeks? ago/, 'w')
    .replace(/ months? ago/, 'mo')
    .replace(/ years? ago/, 'y')
    .replace('a', '1')
    .replace('over', '>')

  return (
    <div
      className={className}
      title={format(timestamp, 'MMM d yyyy, h:mm zz')}
    >
      {timeFromNowAbbreviation}
    </div>
  )
}


export default RelativeTimestamp
