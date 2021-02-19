import React from 'react'
import { Link } from 'react-router-dom'

import Icon from '../../chrome/Icon'

const AppNavItems: React.FC<any> = () => (
  <>
    <Link className='px-4' to='/collection'><Icon icon='list' size='sm' /> Collection</Link>
    <Link className='px-4' to='/activity'><Icon icon='bolt' size='sm' /> Activity Feed</Link>
  </>
)


export default AppNavItems
