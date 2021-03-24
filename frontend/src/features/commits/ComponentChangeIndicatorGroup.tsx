import React from 'react'
import classNames from 'classnames'
import { ChangeStatus } from '../../qri/change'

export interface ComponentChangeIndicatorGroupProps {
  status: ChangeStatus[]
}

const ComponentChangeIndicatorGroup: React.FC<ComponentChangeIndicatorGroupProps> = ({ status }) => (
  <div className='mt-1 -ml-1 w-full flex'>
    {status.map((v, i) => (
      <div key={i} className={classNames(
        'h-2 m-1 flex-grow rounded-lg',
        {
          'border border-gray-400': (v === ChangeStatus.nonexistant),
          'bg-gray-400': (v === ChangeStatus.unchanged),
          'bg-green-500': (v === ChangeStatus.added),
          'bg-red-500': (v === ChangeStatus.removed),
          'bg-yellow-500': (v === ChangeStatus.modified),
        })}>&nbsp;</div>
    ))}
  </div>
)

export default ComponentChangeIndicatorGroup
