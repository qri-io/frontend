import { Reducer, AnyAction } from 'redux'
import { RootState } from '../../../store/store';

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

const initialState = {
  jobs: [
    newJob({
      name: 'testJob',
      alias: 'local job',
      type: 'dataset',
      periodicity: 'R/P1D'
    })
  ],
}

export interface JobState {
  jobs: Job[]
}

export const jobsReducer: Reducer = (state = initialState, action: AnyAction): JobState => {
  switch (action.type) {
    case 'API_JOB_FAILURE':
      return state
    case 'API_JOB_SUCCESS':
      console.log(action);
      return {
        jobs: action.payload.data
      }
    default:
      return state
  }
}
