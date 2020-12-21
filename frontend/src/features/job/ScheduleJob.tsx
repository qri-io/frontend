import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { scheduleJob } from './state/jobActions'
import { newJob } from './state/jobState'

const ScheduleJob: React.FC<any> = () => {
  const dispatch = useDispatch()
  const [job, setJob] = useState(newJob({
    type: 'dataset',
    periodicity: "R2/P1H"
  }))

  const fieldSetter = (field: string) => {
    return (e: React.FormEvent<EventTarget>) => {
      const target = e.target as HTMLInputElement
      setJob(Object.assign({}, job, { [field]: target.value }))
    }
  }

  return (
    <div>
      <input type='text' onChange={fieldSetter('name')} />
      <button onClick={() => dispatch(scheduleJob(job))}>Schedule</button>
    </div>
  );
}

export default ScheduleJob
