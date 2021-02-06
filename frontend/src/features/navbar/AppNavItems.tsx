import React from 'react'
import { Link } from 'react-router-dom'

import Icon from '../../chrome/Icon'

const AppNavItems: React.FC<any> = () => (
  <>
    <Link className='px-1 font-bold text-lg tracking-tight' to='/'>Qrimatic</Link>
    <div className='w-10'></div>
    <Link className='px-4' to='/collection'>Collection</Link>
    <Link className='px-1' to='/notifications'>Notifications</Link>

    <div className='flex ml-auto'>
    <Link id='new-dataset-button' to="/ds/new">
      <div className="px-6 py-2 rounded bg-blue-600 text-blue-50 max-w-max shadow-sm hover:shadow-lg font-semibold">
        <Icon className='mr-3' icon='plus' size='md' /> New Dataset
      </div>
    </Link>
    </div>
  </>
)

export default AppNavItems
