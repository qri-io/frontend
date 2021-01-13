import React from 'react'

const ScheduleModal: React.FC<any> = () => {
  return (
    <div className="mt-3 sm:mt-0 sm:ml-4 sm:text-left">
      <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
          Run this workflow every
      </h3>
      <select className='bg-gray-300 p-2 rounded-md'>
        <option>10 Minutes</option>
        <option>Hour</option>
        <option>Day</option>
        <option>Week</option>
        <option>Month</option>
        <option>Quarter</option>
      </select>

      <p className='mt-2 font-medium'>Ends:</p>
      <div>
        <input type="radio"></input>
        <label>Never</label>
      </div>
      <div>
        <input type="radio" />
        <label>After</label>
        <input className='w-6 m-2 bg-gray-300 inline-block' type='text' value='1' />
        <p>successful updates</p>
      </div>
    </div>
  )
}

export default ScheduleModal
