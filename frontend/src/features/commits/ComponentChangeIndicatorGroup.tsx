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
        (v === ChangeStatus.nonexistant) && 'border border-gray-400',
        (v === ChangeStatus.unchanged) && 'bg-gray-400',
        (v === ChangeStatus.added) && 'bg-green-500',
        (v === ChangeStatus.removed) && 'bg-red-500',
        (v === ChangeStatus.modified) && 'bg-yellow-500',
      )}>&nbsp;</div>
    ))}
  </div>
)

export default ComponentChangeIndicatorGroup
