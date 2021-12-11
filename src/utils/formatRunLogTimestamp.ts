// converts a runlog's Timestamp to a formatted string, used in displaying run logs
import { format } from 'date-fns'

import { toMilliFromNano } from '../qri/run'

export default function formatRunLogTimestamp (t: number): string {
  return format(new Date(toMilliFromNano(t)), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
}
