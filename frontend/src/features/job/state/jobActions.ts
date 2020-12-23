import { AnyAction } from '@reduxjs/toolkit'
import { CALL_API, ApiActionThunk } from '../../../store/api'
import { 
  Job,
  newJob,
  JOB_SCHEDULED,
  JOB_UNSCHEDULED,
  JOB_STARTED,
  JOB_STOPPED,
 } from './jobState'

export function mapJobs(data: Record<string, any>[]): Job[] {
  return data.map(newJob)
}

export function fetchJobs(page: number, pageSize: number): ApiActionThunk {
  return async (dispatch, getState) => {
    return dispatch({
      type: 'job',
      [CALL_API]: {
        endpoint: 'jobs',
        method: 'GET',
        pageInfo: {
          page,
          pageSize,
        },
        map: mapJobs,
      }
    })
  }
};

export function scheduleJob(job: Job): ApiActionThunk {
  return async (dispatch, getState) => {
    console.log('schedule', job)
    return dispatch({
      type: 'job',
      [CALL_API]: {
        endpoint: 'jobs',
        method: 'POST',
        body: job,
      }
    })
  }
}

export function unscheduleJob(name: string): ApiActionThunk {
  return async (dispatch, getState) => {
    return dispatch({
      type: 'job',
      [CALL_API]: {
        endpoint: 'jobs',
        method: 'DELETE',
        query: { name }
      }
    })
  }
}

export interface JobAction extends AnyAction {
  type: string
  data: Job
}

export function jobScheduled(job: Record<string,any>): JobAction {
  return {
    type: JOB_SCHEDULED,
    data: newJob(job)
  }
}

export function jobUnscheduled(job: Record<string,any>): JobAction {
  return {
    type: JOB_UNSCHEDULED,
    data: newJob(job)
  }
}

export function jobStarted(job: Record<string,any>): JobAction {
  return {
    type: JOB_STARTED,
    data: newJob(job)
  }
}

export function jobStopped(job: Record<string,any>): JobAction {
  return {
    type: JOB_STOPPED,
    data: newJob(job)
  }
}