import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { fetchJobs, unscheduleJob } from './state/jobActions'
import { selectJobs } from './state/jobState'
import ScheduleJob from './ScheduleJob'

export default function JobList() {
  const jobs = useSelector(selectJobs);
  const dispatch = useDispatch();

  return (
    <div>
      <ScheduleJob />
      <button onClick={() => dispatch(fetchJobs(1, 50))}>Fetch Them Jobs</button>
      {jobs.map((j, i) => (
        <div key={i}>
          <span>{j.runCount} {j.name} | {j.nextRunStart} | {j.periodicity}</span>
          <button onClick={() => dispatch(unscheduleJob(j.name))}>remove</button>
        </div>)
      )}
    </div>
  );
}