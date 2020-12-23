import { RootState } from '../../../store/store';
import { createReducer } from '@reduxjs/toolkit'
import { JobAction } from './jobActions';

export const JOB_STARTED = 'JOB_STARTED'
export const JOB_STOPPED = 'JOB_STOPPED'
export const JOB_SCHEDULED = 'JOB_SCHEDULED'
export const JOB_UNSCHEDULED = 'JOB_UNSCHEDULED'

export interface Job {
  name: string
  alias: string
  type: 'dataset' | 'shell'
  periodicity: RepeatingInterval
  prevRunStart?: string // actually a date
  
  runNumber?: number
  runStart?: string // actually a date
  runStop?: string // actually a date
  runError?: string
  logFilePath?: string
}

export type RepeatingInterval = Record<string, any>

export function newJob(d: Record<string, any>): Job {
  return {
    name: d.name,
    alias: d.alias,
    type: d.type,
    periodicity: d.periodicity,
    prevRunStart: d.prevRunStart,

    runNumber: d.runNumber,
    runStart: d.runStart,
    runStop: d.runStop,
    runError: d.runError,
    logFilePath: d.logFilePath,
  }
}

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectJobs = (state: RootState): Job[] => state.jobs.jobs

export interface JobState {
  jobs: Job[]
}

const initialState: JobState = {
  jobs: [
    newJob({
      name: 'testJob',
      alias: 'local job',
      type: 'dataset',
      periodicity: 'R/P1D'
    })
  ],
}

export const jobsReducer = createReducer(initialState, {
  'API_JOB_SUCCESS': (state, action) => {
    state.jobs = action.payload.data
  },
  JOB_STARTED: updateJob,
  JOB_STOPPED: updateJob,
  JOB_SCHEDULED: updateJob,
  JOB_UNSCHEDULED: updateJob,
})

function updateJob(state: JobState, action: JobAction) {
  const i = state.jobs.findIndex((j) => j.name === action.data.name)
  if (i === -1) {
    state.jobs.push(action.data)
    return
  }

  state.jobs[i] = action.data
}