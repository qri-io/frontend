import React from 'react'
import { Link } from 'react-router-dom'

const AppNavItems: React.FC<any> = () => (
  <>
    <Link className='px-1 font-bold' to='/'>Qrimatic</Link>
    <div className='w-10'></div>
    <Link className='px-1' to='/collection'>Collection</Link>
    <Link className='px-1' to='/notifications'>Notifications</Link>
    <Link className='px-1' to='/ds/new'>New Workflow</Link>
  </>
)

export default AppNavItems
