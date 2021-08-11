import getMinutes from 'date-fns/getMinutes'
import format from 'date-fns/format'

import { CronTrigger } from '../../qrimatic/workflow'
import { SelectOption } from '../../chrome/Select'

// for hourly cron triggers, only these values are valid for specifying the minutes
export type HourlyTriggerMinutes = '00' | '15' | '30' | '45'

// gets the minutes from an ISO8601 time string, returns them as a two-digit string
export const getTwoDigitMinutes = (time: string) => {
  return getMinutes(new Date(time))
    .toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false
    }) as HourlyTriggerMinutes
}

// used to specify the minutes for hourly triggers
// this is used as labels/values for DropdownMenu, and as a lookup object
export const hourlyItems: SelectOption[] = [
  { value: '00', label: 'on the hour' },
  { value: '15', label: 'on the 1/4-hour' },
  { value: '30', label: 'on the half-hour' },
  { value: '45', label: 'on the 3/4-hour' }
]

// given a starttime as an ISO8601 timestamp, get the minutes and return the corresponding label
export const parseHourlyStart = (startTime: string) => {
  const minutes: HourlyTriggerMinutes = getTwoDigitMinutes(startTime)
  return hourlyItems.find(d => d.value === minutes)?.label
}

// given a starttime as an ISO8601 timestamp, return a human readable timestamp (4:30 PM)
export const parseDailyStart = (startTime: string) => {
  return `at ${format(new Date(startTime), 'p')}`
}

// takes an ISO8601 scheduled interval, returns scheduleUIConfig object
export const scheduleFromPeriodicity = (periodicity: string = ''): Schedule => {
  const [, startTime, interval] = periodicity.split('/')

  const defaultScheduleUIConfig = {
    periodicity: 'P1D',
    minutes: '00',
    time: '21:00'
  }

  switch (interval) {
    case 'PT10M':
      return {
        ...defaultScheduleUIConfig,
        periodicity: interval,
        minutes: '00',
      } as Schedule
    case 'P1H':
      return {
        ...defaultScheduleUIConfig,
        periodicity: interval,
        minutes: getTwoDigitMinutes(startTime)
      } as Schedule
    case 'P1D':
      return {
        ...defaultScheduleUIConfig,
        periodicity: interval,
        time: format(new Date(startTime), 'HH:mm'),
      } as Schedule
     default:
       return defaultScheduleUIConfig
  }
}

// Schedule stores the value for each UI element used to create cron triggers
// periodicity is always defined, minutes is needed when periodicity is 'hourly',
// time is needed when periodicity is 'daily'
// no additional info is needed when periodicty is 'ten-minutes', script will run on the 10s
export interface Schedule {
  periodicity: string
  minutes: string
  time: string
}

// convert the UI values into a valid CronTrigger
export const triggerFromSchedule = (schedule: Schedule): CronTrigger => {
  // convert the UI settings into a valid WorkflowTrigger
  let periodicity
  let startTime
  const today = new Date()

  // for every 10 minutes, periodicity is 'R/PT10M'
  switch (schedule.periodicity) {
    case 'PT10M':
      // get most recent previous hour, the ten-minutes interval will run at 00, 10, 20, 30, ...
      startTime = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        today.getHours(),
        0,
        0
      ).toISOString()

      periodicity = `R/${startTime}/PT10M`
      break
    case 'P1H':
      // for hourly, periodicity is R/P1H and startTime is the next instance of
      // the minutes selected by the user
      // get most recent previous hour, add minutes, convert to ISO8601
      startTime = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        today.getHours(),
        parseInt(schedule.minutes),
        0
      ).toISOString()

      periodicity = `R/${startTime}/P1H`
      break
     case 'P1D':
       // time is in HH:MM format in local time (24 hour hours)
      const [hours, minutes] = schedule.time.split(':')

      // get ISO8601 string for today at the specified hours+minutes
      startTime = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        parseInt(hours),
        parseInt(minutes),
        0
      ).toISOString()

      periodicity = `R/${startTime}/P1D`
      break
  }

  return {
    type: 'cron',
    active: true,
    periodicity,
  }
}
