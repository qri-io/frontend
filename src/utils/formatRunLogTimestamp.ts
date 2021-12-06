// converts a runlog's Timestamp to a formatted string, used in displaying run logs
import { fromUnixTime, format } from 'date-fns'

export default function formatRunLogTimestamp (t: number): string {
  const unixSeconds = parseInt(t.toString().slice(0, -9))
  return format(fromUnixTime(unixSeconds), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
}
