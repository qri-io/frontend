import React from 'react'

const normalizeSeconds = (seconds: number): string => {
  return seconds / 10 < 1 ? `0${seconds}` : String(seconds)
}

const SECONDS_IN_MINUTE = 60
const SECONDS_IN_HOUR = 60 * SECONDS_IN_MINUTE
const SECONDS_IN_DAY = 24 * SECONDS_IN_HOUR

// converts a total number of seconds into a string representation with the
// longest duration in days
// seconds are always represented, and always shown with two digits
export const convertToDuration = (totalSeconds: number): string => {
  if (totalSeconds < 60) {
    return `0m ${normalizeSeconds(totalSeconds)}s`
  }
  let dur = ``
  let seconds = totalSeconds

  let days = Math.floor(seconds/SECONDS_IN_DAY)
  dur += days ? `${days}d` : ``
  seconds -= days * SECONDS_IN_DAY

  let hours = Math.floor(seconds/SECONDS_IN_HOUR)
  if (dur || hours) {
    dur += dur ? ` ${hours}h` : `${hours}h`
  }
  seconds -= hours * SECONDS_IN_HOUR

  let minutes = Math.floor(seconds/SECONDS_IN_MINUTE)
  if (dur || minutes) {
    dur += dur ? ` ${minutes}m` : `${minutes}m`
  }

  seconds -= minutes * SECONDS_IN_MINUTE
  dur += dur ? ` ${normalizeSeconds(seconds)}s` : `${normalizeSeconds(seconds)}s`
  return dur
}


interface DurationFormatProps {
  seconds?: number
}

const DurationFormat: React.FunctionComponent<DurationFormatProps> = ({ seconds }) => {
  if (!seconds) return null
  return (<span>
    {convertToDuration(seconds)}
  </span>)
}

export default DurationFormat
