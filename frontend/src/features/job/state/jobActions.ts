import { CALL_API, ApiActionThunk } from '../../../store/api'
import { Job, newJob } from './jobState'

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
